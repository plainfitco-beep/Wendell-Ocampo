import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

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

// Set up directories for persistent uploads and metadata DB
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const METADATA_FILE = path.join(UPLOADS_DIR, "metadata.json");
const SUBSCRIBERS_FILE = path.join(UPLOADS_DIR, "subscribers.json");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Seed empty databases if not present
if (!fs.existsSync(METADATA_FILE)) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
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
