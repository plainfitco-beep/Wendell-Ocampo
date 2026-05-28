import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

interface AssetMetadata {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description: string;
  fileSize: string;
  category: string;
  fileFormat: string;
  downloadCount: number;
  uploadDate: string;
  price?: number;
}

interface Subscriber {
  email: string;
  timestamp: string;
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@wendellocampo.com",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

// Set up directories for persistent uploads and metadata DB
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const METADATA_FILE = path.join(UPLOADS_DIR, "metadata.json");
const SUBSCRIBERS_FILE = path.join(UPLOADS_DIR, "subscribers.json");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Seed empty databases if not present
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
}

let seedAssets: AssetMetadata[] = [];
try {
  const imagesSourceDir = path.join(process.cwd(), "src", "assets", "images");
  if (fs.existsSync(imagesSourceDir)) {
    const files = fs.readdirSync(imagesSourceDir);
    const pngFiles = files.filter(f => f.endsWith(".png") && f !== "wo_logo.png" && f !== "living_room_bg.png");
    
    // Copy each png to uploads directory
    pngFiles.forEach(file => {
      const srcPath = path.join(imagesSourceDir, file);
      const destPath = path.join(UPLOADS_DIR, file);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    });

    // Create seed database array
    seedAssets = [
      {
        id: "asset-monolith-png",
        filename: "brutalist_monolith.png",
        originalName: "brutalist_monolith.png",
        title: "The Brutalist Monolith High-Res Render",
        description: "High-resolution 4K PNG render of the Brutalist Monolith mountain villa design.",
        fileSize: "2.4 MB",
        category: "Architectural",
        fileFormat: ".png",
        downloadCount: 18,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-japandi-png",
        filename: "japandi_sanctuary.png",
        originalName: "japandi_sanctuary.png",
        title: "Japandi Sanctuary Common High-Res Render",
        description: "Premium 4K PNG landscape render of the Japandi-style living space interior design.",
        fileSize: "1.8 MB",
        category: "Interior Design",
        fileFormat: ".png",
        downloadCount: 12,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-modular-png",
        filename: "spatio_modular_living.png",
        originalName: "spatio_modular_living.png",
        title: "Spatio Modular Living High-Res Render",
        description: "Futuristic luxury modular high-rise tower design render in 4K PNG format.",
        fileSize: "3.1 MB",
        category: "Architectural",
        fileFormat: ".png",
        downloadCount: 24,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-pavilion-png",
        filename: "parametric_fluid_pavilion.png",
        originalName: "parametric_fluid_pavilion.png",
        title: "Parametric Fluid Pavilion High-Res Render",
        description: "A dynamic cultural centre pavilion with fiberglass curved shells and mirror pools.",
        fileSize: "2.9 MB",
        category: "Architectural",
        fileFormat: ".png",
        downloadCount: 15,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-kitchen-png",
        filename: "terrazzo_kitchen.png",
        originalName: "terrazzo_kitchen.png",
        title: "Terrazzo Kitchen Laboratory High-Res Render",
        description: "Moody, high-contrast dark concrete kitchen island featuring custom aggregate terrazzo.",
        fileSize: "1.6 MB",
        category: "Luxury Interior Space",
        fileFormat: ".png",
        downloadCount: 9,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-soundsphere-png",
        filename: "sound_sphere.png",
        originalName: "sound_sphere.png",
        title: "Solfeggio Sound Sphere Concept High-Res",
        description: "High-fidelity industrial product concept rendering of dual-chamber speaker mesh.",
        fileSize: "1.2 MB",
        category: "Product Design",
        fileFormat: ".png",
        downloadCount: 7,
        uploadDate: new Date().toISOString(),
        price: 0
      },
      {
        id: "asset-spatiotower-png",
        filename: "spatio_tower_render.png",
        originalName: "spatio_tower_render.png",
        title: "Spatio Tower Rendering High-Res",
        description: "Pre-graded, cinematic 4K PNG structural tower visualization render.",
        fileSize: "3.5 MB",
        category: "Architectural",
        fileFormat: ".png",
        downloadCount: 31,
        uploadDate: new Date().toISOString(),
        price: 0
      }
    ];
  }
} catch (e) {
  console.error("Error seeding assets:", e);
}

// Write seed metadata if empty or not exist
if (!fs.existsSync(METADATA_FILE)) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(seedAssets, null, 2));
} else {
  try {
    const existingData = JSON.parse(fs.readFileSync(METADATA_FILE, "utf-8"));
    if (!Array.isArray(existingData) || existingData.length === 0) {
      fs.writeFileSync(METADATA_FILE, JSON.stringify(seedAssets, null, 2));
    }
  } catch(e) {
    fs.writeFileSync(METADATA_FILE, JSON.stringify(seedAssets, null, 2));
  }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size ceiling
});

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helpers to read/write persistent files safely
function readAssets(): AssetMetadata[] {
  try {
    const data = fs.readFileSync(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeAssets(assets: AssetMetadata[]) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(assets, null, 2));
}

function readSubscribers(): Subscriber[] {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeSubscribers(subs: Subscriber[]) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

// ================= API ENDPOINTS =================

// 1. Get List of Available 3D Assets
app.get("/api/assets", (req, res) => {
  const assets = readAssets();
  res.json({ success: true, assets });
});

// 2. Fetch list of Subscribers (for admin reference panel)
app.get("/api/subscribers", (req, res) => {
  const subscribers = readSubscribers();
  res.json({ success: true, subscribers });
});

// 3. New subscription register
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Invalid email reference" });
  }

  const subs = readSubscribers();
  const exists = subs.find(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (!exists) {
    subs.push({
      email,
      timestamp: new Date().toISOString()
    });
    writeSubscribers(subs);
  }

  res.json({ success: true, message: "Subscription verified successfully" });
});

// 3.5. Send email inquiry via Hostinger SMTP
app.post("/api/inquiry", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required fields" });
  }

  if (!process.env.EMAIL_PASSWORD) {
    console.warn("EMAIL_PASSWORD environment variable is not configured on the server.");
    return res.status(500).json({ 
      success: false, 
      message: "Server SMTP credentials are not configured. Please define EMAIL_PASSWORD in Settings." 
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `"Website Form" <info@wendellocampo.com>`,
      to: "info@wendellocampo.com",
      replyTo: email,
      subject: `New inquiry from ${name}: ${subject || 'General 3D Inquiry'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    console.log("Inquiry email dispatched successfully: ", info.messageId);
    res.json({ success: true, message: "Inquiry emailed successfully" });
  } catch (error: any) {
    console.error("Nodemailer error: ", error);
    res.status(500).json({ 
      success: false, 
      message: "Email sending failed. Please check SMTP parameters/credentials or contact support.",
      error: error?.message || error
    });
  }
});

// 4. Admin asset upload endpoint
app.post("/api/assets/upload", upload.single("assetFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No 3D asset file provided" });
    }

    const { title, description, category, price } = req.body;
    const fileFormat = path.extname(req.file.originalname).toLowerCase() || ".glb";
    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

    const assets = readAssets();
    const newAsset: AssetMetadata = {
      id: "asset-" + Math.random().toString(36).substring(2, 11),
      filename: req.file.filename,
      originalName: req.file.originalname,
      title: title || req.file.originalname,
      description: description || "No custom description specified.",
      category: category || "General",
      fileFormat,
      fileSize: sizeInMB,
      downloadCount: 0,
      uploadDate: new Date().toISOString(),
      price: price ? parseFloat(price) : 39.00
    };

    assets.push(newAsset);
    writeAssets(assets);

    res.json({ success: true, asset: newAsset });
  } catch (err: any) {
    console.error("Upload error: ", err);
    res.status(500).json({ success: false, message: err?.message || "Internal upload system failed" });
  }
});

// 5. Admin Delete Asset
app.delete("/api/assets/:id", (req, res) => {
  const { id } = req.params;
  const assets = readAssets();
  const itemIndex = assets.findIndex(a => a.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: "Asset reference not found in pipeline" });
  }

  const assetToDelete = assets[itemIndex];
  const filePath = path.join(UPLOADS_DIR, assetToDelete.filename);

  // Erase from filesystem
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Erase from metadata database
  assets.splice(itemIndex, 1);
  writeAssets(assets);

  res.json({ success: true, message: "Asset purged from repository successfully" });
});

// 6. Secure Subscriber File Download
app.get("/api/assets/download/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  if (!email || typeof email !== 'string' || !email.includes("@")) {
    return res.status(403).json({ 
      success: false, 
      message: "Direct transmission forbidden. Subscription verification email required." 
    });
  }

  // Register downloading email as a subscriber if not already in system
  const subs = readSubscribers();
  const exists = subs.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    subs.push({
      email,
      timestamp: new Date().toISOString()
    });
    writeSubscribers(subs);
  }

  const assets = readAssets();
  const asset = assets.find(a => a.id === id);

  if (!asset) {
    return res.status(404).json({ success: false, message: "Active asset link does not exist" });
  }

  const fileLocation = path.join(UPLOADS_DIR, asset.filename);

  if (!fs.existsSync(fileLocation)) {
    return res.status(404).json({ success: false, message: "Actual file payload is missing from disk" });
  }

  // Update download analytics
  asset.downloadCount += 1;
  writeAssets(assets);

  // Send binary file chunk stream
  res.download(fileLocation, asset.originalName);
});

// ================= GEMINI CHATBOT API =================
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured on the server. Please add it in project Settings > Secrets.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "Invalid message history structure" });
  }

  try {
    const aiClient = getGeminiClient();
    
    // Map history to Google GenAI format: { role: 'user' | 'model', parts: [{ text: '...' }] }
    // Filter messages with actual content
    const formattedContents = messages
      .filter((m: any) => m && m.content)
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    if (formattedContents.length === 0) {
      return res.status(400).json({ success: false, message: "No active messages were found in request payload" });
    }

    const systemInstruction = 
      "You are a helpful, professional, and friendly 3D Design Assistant named 'Onyx', developed to assist visitors on the " +
      "portfolio website of Wendell Ocampo. Wendell is an elite 3D Designer who specializes in high-fidelity " +
      "spatial visualizations across architecture, interior design, product rendering, and landscape concept modeling. " +
      "He uses WebGL and state-of-the-art interactive engines. " +
      "\n\nRules of engagement:\n" +
      "1. Be extremely polite, professional, and concise. " +
      "2. Respond to users detailing Wendell's skills: interactive 3D spaces, interior design CGI, architectural planning, product visualization, custom WebGL applications.\n" +
      "3. Highlight that users can visit the 'Showroom' (3D Gallery tab) to view and download his premium asset files and renders or explore the interactive 3D meshes directly on their browsers.\n" +
      "4. Direct users to the contact/inquiry section or suggest emailing info@wendellocampo.com if they want to hire Wendell for custom spatial projections or premium digital solutions.\n" +
      "5. Do NOT mention third-party rendering engines like D5 Render or Corona - Wendell’s tools are styled as custom real-time WebGL engines.\n" +
      "6. Keep responses clean, stylish, formatted in short Markdown paragraphs with bullet points.";

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
      }
    });

    const reply = response.text || "I apologize, but I was unable to compile a response at this time. Let's try redirecting your request to info@wendellocampo.com!";
    res.json({ success: true, response: reply });
  } catch (error: any) {
    console.error("Gemini API error in /api/chat:", error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || "An error occurred with the conversational backend. Make sure GEMINI_API_KEY is configured."
    });
  }
});

async function runExpress() {
  // Vite assets injection
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wendell Ocampo Backend engine online on http://0.0.0.0:${PORT}`);
  });
}

runExpress();
