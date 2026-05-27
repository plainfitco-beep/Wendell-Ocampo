import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileBox, 
  UploadCloud, 
  Download, 
  Trash2, 
  Mail, 
  Lock, 
  UserCheck, 
  Search, 
  Info, 
  Check, 
  Compass, 
  Layers, 
  Key, 
  Users, 
  Cpu, 
  AlertCircle,
  FolderOpen,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  X
} from "lucide-react";

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

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Preset items to display in client view when there are no assets uploaded yet
const DEFAULT_PRESET_ASSETS: AssetMetadata[] = [
  {
    id: "preset-1",
    filename: "futuristic_villa.glb",
    originalName: "futuristic_villa.glb",
    title: "Spatio Modular Living High-Res Mesh",
    description: "Premium architectural tower component featuring glass-facade panels, columns, and structural slabs. Ideal for detailed landscape rendering.",
    fileSize: "18.4 MB",
    category: "Architectural",
    fileFormat: ".glb",
    downloadCount: 142,
    uploadDate: new Date().toISOString(),
    price: 89.00
  },
  {
    id: "preset-2",
    filename: "mid_century_armchair.obj",
    originalName: "mid_century_armchair.obj",
    title: "Minimalist Linen Armchair Profile",
    description: "Bespoke linen texture frame incorporating curved wooden armrests and realistic cushioning fabrics. Textured in high ambient detail.",
    fileSize: "8.1 MB",
    category: "Interior Design",
    fileFormat: ".obj",
    downloadCount: 96,
    uploadDate: new Date().toISOString(),
    price: 45.00
  },
  {
    id: "preset-3",
    filename: "sound_sphere_module.gltf",
    originalName: "sound_sphere_module.gltf",
    title: "Sound Sphere Conceptual Model",
    description: "Multi-layered mechanical speaker sphere featuring acoustical wireframe meshes and dynamic internal driver core geometries.",
    fileSize: "12.7 MB",
    category: "Product Design",
    fileFormat: ".gltf",
    downloadCount: 68,
    uploadDate: new Date().toISOString(),
    price: 65.00
  },
  {
    id: "preset-4",
    filename: "modern_cabin_teaser.mp4",
    originalName: "modern_cabin_teaser.mp4",
    title: "Modern Cabin High-End Marketing Teaser",
    description: "Fully mastered marketing video and promotional B-roll suite for modern woodland retreats. Includes social media aspect ratios and high contrast material grading.",
    fileSize: "42.5 MB",
    category: "Marketing Videos",
    fileFormat: ".mp4",
    downloadCount: 112,
    uploadDate: new Date().toISOString(),
    price: 120.00
  }
];

export function AssetsPage() {
  const [assets, setAssets] = useState<AssetMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  
  // Client download email session
  const [clientEmail, setClientEmail] = useState<string>(() => {
    return localStorage.getItem("wendell_client_email") || "";
  });
  const [emailInput, setEmailInput] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subsMessage, setSubsMessage] = useState<string>("");
  const [subsLoading, setSubsLoading] = useState<boolean>(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Creator Portal Security state
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string>("");

  // Upload state
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadDesc, setUploadDesc] = useState<string>("");
  const [uploadCat, setUploadCat] = useState<string>("Architectural");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadPrice, setUploadPrice] = useState<string>("");

  // Basket (Shopping Cart) States
  const [basket, setBasket] = useState<AssetMetadata[]>(() => {
    try {
      const saved = localStorage.getItem("wendell_asset_basket");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchasedAssetIds, setPurchasedAssetIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("wendell_purchased_assets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("card");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [paypalEmail, setPaypalEmail] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [billingEmail, setBillingEmail] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");

  // Sync basket and purchases to localStorage
  useEffect(() => {
    localStorage.setItem("wendell_asset_basket", JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem("wendell_purchased_assets", JSON.stringify(purchasedAssetIds));
  }, [purchasedAssetIds]);

  // Fetch all assets from backend
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/assets`);
      const data = await res.json();
      if (data.success && data.assets && data.assets.length > 0) {
        setAssets(data.assets);
      } else {
        setAssets(DEFAULT_PRESET_ASSETS);
      }
    } catch (err) {
      console.warn("Express backend URL not reached. Defaulting to Hostinger static fallback assets mode.", err);
      setAssets(DEFAULT_PRESET_ASSETS);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers for Admin Reference List
  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subscribers`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    }
  };

  useEffect(() => {
    fetchAssets();
    // Verify client session email local storage
    if (clientEmail && clientEmail.includes("@")) {
      setIsSubscribed(true);
    }
  }, [clientEmail]);

  // Handle Client email subscription check
  const handleClientSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setSubsMessage("Please enter a valid email address reference.");
      return;
    }
    setSubsLoading(true);
    setSubsMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("wendell_client_email", emailInput);
        setClientEmail(emailInput);
        setIsSubscribed(true);
        setSubsMessage("Verification completed. Premium downloads unlocked!");
        
        // Push subscription state to local storage newsletter list for legacy consistency
        const existing = localStorage.getItem("wendell_newsletter_signups");
        const list = existing ? JSON.parse(existing) : [];
        const existsLocally = list.find((item: any) => item.email.toLowerCase() === emailInput.toLowerCase());
        if (!existsLocally) {
          list.push({ email: emailInput, timestamp: new Date().toISOString() });
          localStorage.setItem("wendell_newsletter_signups", JSON.stringify(list));
        }
      } else {
        setSubsMessage(data.message || "Failed to register subscription.");
      }
    } catch (err) {
      setSubsMessage("Backend connection offline. Please enter any email to simulate verification.");
      // Graceful fallback for local preview environments
      localStorage.setItem("wendell_client_email", emailInput);
      setClientEmail(emailInput);
      setIsSubscribed(true);
    } finally {
      setSubsLoading(false);
    }
  };

  // Log out of subscriber session
  const logoutSubscriber = () => {
    localStorage.removeItem("wendell_client_email");
    setClientEmail("");
    setIsSubscribed(false);
    setEmailInput("");
    setSubsMessage("");
  };

  // Handle Admin Session Unlock
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminToken.toLowerCase() === "admin" || adminToken.toLowerCase() === "wendell3d") {
      setIsAdminUnlocked(true);
      setAdminError("");
      fetchSubscribers();
    } else {
      setAdminError("Invalid security token. Use 'admin' or 'wendell3d' to access.");
    }
  };

  // Basket operations
  const addToBasket = (asset: AssetMetadata) => {
    if (basket.some(item => item.id === asset.id)) {
      setIsBasketOpen(true);
      return;
    }
    setBasket(prev => [...prev, asset]);
    setIsBasketOpen(true);
  };

  const removeFromBasket = (assetId: string) => {
    setBasket(prev => prev.filter(item => item.id !== assetId));
  };

  // Input styling and formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < raw.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += raw[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = "";
    if (raw.length > 0) {
      formatted += raw.substring(0, 2);
      if (raw.length > 2) {
        formatted += "/" + raw.substring(2, 4);
      }
    }
    setCardExpiry(formatted);
  };

  // Simulate payment processing
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (!billingEmail || !billingEmail.includes("@")) {
      setPaymentError("Kindly indicate a valid email address for receipt distribution.");
      return;
    }

    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setPaymentError("Standard Credit Card parameters must span exactly 16 digits.");
        return;
      }
      if (!cardExpiry.includes("/")) {
        setPaymentError("A valid MM/YY expiration value is required.");
        return;
      }
      if (cardCvc.length < 3) {
        setPaymentError("Safety CV2 parameter requires at least 3 digits.");
        return;
      }
    } else {
      if (!paypalEmail || !paypalEmail.includes("@")) {
        setPaymentError("Provide a valid PayPal account address.");
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const completedIds = basket.map(item => item.id);
      
      setPurchasedAssetIds(prev => {
        const merged = [...prev];
        completedIds.forEach(id => {
          if (!merged.includes(id)) merged.push(id);
        });
        return merged;
      });

      // Update both checkout billing email and global subscriber access
      setClientEmail(billingEmail);
      localStorage.setItem("wendell_client_email", billingEmail);
      setIsSubscribed(true);

      setIsProcessingPayment(false);
      setPaymentCompleted(true);
      setBasket([]);

      // Trigger automatic subscriber logging on the server
      fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: billingEmail })
      }).catch(() => {});

    }, 2200);
  };

  const resetPaymentSuccess = () => {
    setPaymentCompleted(false);
    setIsBasketOpen(false);
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaypalEmail("");
    setBillingEmail("");
    setPaymentError("");
  };

  // Native Client Download trigger
  const triggerAssetDownload = (asset: AssetMetadata) => {
    // Check if asset is premium/paid and not yet unlocked
    if (asset.price && asset.price > 0 && !purchasedAssetIds.includes(asset.id)) {
      addToBasket(asset);
      return;
    }

    if (!clientEmail || !clientEmail.includes("@")) {
      setSubsMessage("Verification required to access. Enter email reference below.");
      // Scroll smoothly to download box
      document.getElementById("verification-box")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Dynamic clean client download link setup (ignores popup blockers)
    const link = document.createElement("a");
    link.href = `${API_BASE}/api/assets/download/${asset.id}?email=${encodeURIComponent(clientEmail)}`;
    link.download = asset.originalName || asset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Increment download analytics count locally for visual snap responsiveness
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, downloadCount: a.downloadCount + 1 } : a));
  };

  // Drag and drop mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Handle Asset creation upload submit
  const handleAssetUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadProgress("Please specify an actual 3D asset file (.glb, .obj, .gltf).");
      return;
    }
    if (!uploadTitle) {
      setUploadProgress("Please insert a file title label.");
      return;
    }

    setUploadLoading(true);
    setUploadProgress("Transmitting asset package payload to Wendell server...");

    const formData = new FormData();
    formData.append("assetFile", uploadFile);
    formData.append("title", uploadTitle);
    formData.append("description", uploadDesc);
    formData.append("category", uploadCat);
    if (uploadPrice) {
      formData.append("price", uploadPrice);
    }

    try {
      const res = await fetch(`${API_BASE}/api/assets/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setUploadProgress("Success! Purifying asset pipelines completed.");
        setUploadFile(null);
        setUploadTitle("");
        setUploadDesc("");
        setUploadPrice("");
        // Refresh items table
        fetchAssets();
      } else {
        setUploadProgress(data.message || "Failed to commit package to repository.");
      }
    } catch (err) {
      setUploadProgress("Connection failure. Preserving item index temporarily.");
      // Offline fallback simulations
      const fallbackAsset: AssetMetadata = {
        id: "asset-" + Math.random().toString(36).substring(2, 11),
        filename: uploadFile.name,
        originalName: uploadFile.name,
        title: uploadTitle,
        description: uploadDesc || "Conceptual rendering asset.",
        fileSize: (uploadFile.size / (1024 * 1024)).toFixed(2) + " MB",
        category: uploadCat,
        fileFormat: uploadFile.name.substring(uploadFile.name.lastIndexOf(".")),
        downloadCount: 0,
        uploadDate: new Date().toISOString(),
        price: uploadPrice ? parseFloat(uploadPrice) : 39.00
      };
      setAssets(prev => [...prev, fallbackAsset]);
      setUploadProgress("Simulated offline transfer completed successfully.");
      setUploadFile(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadPrice("");
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete / Purge asset from repository
  const purgeAsset = async (id: string) => {
    if (!confirm("Are you certain you wish to purge this asset completely from backend disk?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/assets/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchAssets();
      }
    } catch (err) {
      // Local fallback
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  // Filter lists based on search parameter and category selection
  const activeDisplayList = assets.length > 0 ? assets : DEFAULT_PRESET_ASSETS;
  const filteredAssets = activeDisplayList.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.fileFormat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || asset.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="assets-panel" className="w-full min-h-screen bg-neutral-950 text-white flex flex-col items-center py-6 relative overflow-hidden font-sans">
      
      {/* Visual background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-sky-950/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-950/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium font-mono mb-5 select-none">
            <FileBox className="w-3.5 h-3.5 text-sky-400" />
            <span>Developer Pipeline Vault</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display text-white mt-2">
            3D Assets <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-500">Repository</span>
          </h1>
          <p className="text-neutral-400 mt-4 text-sm md:text-base leading-relaxed tracking-wide font-light max-w-2xl">
            A secure terminal for clients to extract, view, and implement premium geometric model files. Subscribe to obtain structural pipeline parameters.
          </p>

          {/* Verification / Subscriber Status bar */}
          <div id="verification-box" className="mt-8 w-full max-w-md bg-white/[0.02] border border-white/5 p-5 rounded-3xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div 
                  key="subscribed"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full select-none">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-semibold text-white">SUBSCRIBER ACCESS KEY</p>
                      <p className="text-xs text-neutral-500 font-mono truncate max-w-[200px]">{clientEmail}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logoutSubscriber}
                    className="text-[10px] font-mono hover:text-white text-neutral-500 bg-white/5 px-3 py-1.5 border border-white/5 hover:border-white/15 rounded-lg cursor-pointer transition-colors"
                  >
                    DISCONNECT
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="unsubscribed"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex flex-col gap-3 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-widest">Subscriber Gateway Locked</span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light leading-normal">
                    Enter your subscribed reference address to immediately unlock high-fidelity assets. Non-subscribers will be enrolled automatically.
                  </p>
                  
                  <form onSubmit={handleClientSubscribe} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="address@service.com"
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 focus:border-white/25 rounded-xl font-mono text-xs text-white focus:outline-none placeholder:text-neutral-700"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={subsLoading}
                      className="bg-white hover:bg-neutral-200 text-black px-4.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>{subsLoading ? "Verifying..." : "Unlock"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {subsMessage && (
              <p className="text-[10px] font-mono font-medium text-emerald-400 mt-3 text-left">
                {subsMessage}
              </p>
            )}
          </div>
        </div>

        {/* Search and Filters Segment */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {["All", "Architectural", "Interior Design", "Product Design", "Marketing Videos"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-white text-black border-white font-semibold" 
                    : "bg-transparent text-neutral-400 border-white/5 hover:border-white/20"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query file format, tag structure..."
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/15 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Asset Items Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => {
              const fileColor = 
                asset.fileFormat === ".glb" ? "text-cyan-400 bg-cyan-500/5" :
                asset.fileFormat === ".obj" ? "text-amber-400 bg-amber-500/5" :
                "text-purple-400 bg-purple-500/5";

              return (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-[#0a0a0c] p-6 hover:border-white/20 transition-all flex flex-col justify-between group relative shadow-xl shadow-black/40 hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 text-[10px] font-mono tracking-widest rounded-lg border border-white/5 ${fileColor}`}>
                        {asset.fileFormat.toUpperCase().replace(".", "")} FILE
                      </span>
                      <div className="flex items-center gap-2">
                        {asset.price && asset.price > 0 ? (
                          purchasedAssetIds.includes(asset.id) ? (
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono font-semibold tracking-wide select-none">
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[#00FAFF] font-mono font-semibold tracking-wide">
                              ${asset.price.toFixed(2)}
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-white/5 text-neutral-400 font-mono select-none">
                            FREE
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-mono tracking-wide flex items-center gap-1 select-none">
                          <Layers className="w-3 h-3" />
                          {asset.fileSize}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-sky-300 transition-colors">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
                        {asset.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Category Tag</span>
                      <span className="text-xs text-neutral-300 font-medium font-mono truncate max-w-[120px]">{asset.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {asset.price && asset.price > 0 && !purchasedAssetIds.includes(asset.id) ? (
                        basket.some(item => item.id === asset.id) ? (
                          <button
                            type="button"
                            onClick={() => setIsBasketOpen(true)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold hover:bg-sky-500/20 transition-all cursor-pointer transition-transform duration-200 active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>In Basket</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToBasket(asset)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-semibold hover:bg-white hover:text-black transition-all cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-inherit" />
                            <span>Buy Design</span>
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerAssetDownload(asset)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSubscribed 
                              ? "bg-white text-black border-white hover:scale-105" 
                              : "bg-neutral-900 text-neutral-400 border-white/5 hover:border-white/15"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAssets.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center border border-dashed border-white/10 rounded-3xl bg-neutral-900/40">
              <FolderOpen className="w-12 h-12 text-neutral-600 mx-auto stroke-[1.5]" />
              <p className="text-sm font-mono text-neutral-500 mt-4 font-semibold">No assets match filtering query.</p>
              <p className="text-xs text-neutral-600 font-light mt-1">Refine your tags or category indicators above.</p>
            </div>
          )}
        </div>

        {/* Creator Portal Gateway Control Area */}
        <div className="border-t border-white/10 pt-10 pb-16">
          <div className="flex flex-col items-center">
            
            <button
              type="button"
              onClick={() => {
                setShowAdminPortal(!showAdminPortal);
                setAdminError("");
              }}
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showAdminPortal ? "Hide Developer Portal Terminal" : "Authorized Creator Upload terminal"}</span>
            </button>

            <AnimatePresence>
              {showAdminPortal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl overflow-hidden mt-6"
                >
                  <div className="bg-white/[0.01] border border-white/10 rounded-[32px] p-6 sm:p-8 mt-4 text-left shadow-2xl shadow-black/80 flex flex-col gap-6">
                    
                    {/* Access Verification Panel */}
                    {!isAdminUnlocked ? (
                      <form onSubmit={handleAdminVerify} className="max-w-md mx-auto w-full text-center flex flex-col gap-4 py-8">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-base font-bold text-white font-display">Developer Cryptogram Prompt</h5>
                          <p className="text-xs text-neutral-500 font-light mt-1">
                            Insert security credentials to access file allocation uploaders.
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={adminToken}
                            onChange={(e) => setAdminToken(e.target.value)}
                            placeholder="Enter gate key..."
                            className="flex-1 bg-black border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20"
                          />
                          <button
                            type="submit"
                            className="bg-white text-black px-4.5 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                          >
                            Authenticate
                          </button>
                        </div>
                        {adminError && (
                          <p className="text-[10px] text-red-400 font-mono text-center flex items-center justify-center gap-1 select-none">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {adminError}
                          </p>
                        )}
                      </form>
                    ) : (
                      // Authentic Creator Layout
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Column Left: Upload form (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00FAFF]">STATION CENTRAL UPLOAD</span>
                            <h3 className="text-xl font-bold text-white font-display mt-1">Transmit Native Asset</h3>
                          </div>

                          <form onSubmit={handleAssetUploadSubmit} className="space-y-4">
                            
                            {/* Title picker */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-neutral-400">File Display Label</label>
                              <input 
                                type="text"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                placeholder="e.g., Japandi Oak Modular Shelf"
                                className="w-full bg-black border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700"
                                required
                              />
                            </div>

                            {/* Price field */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-neutral-400 block">Design Price ($) <span className="text-[9px] text-[#00FAFF] font-mono font-normal">(blank or 0 for FREE)</span></label>
                              <input 
                                type="number"
                                step="0.01"
                                min="0"
                                value={uploadPrice}
                                onChange={(e) => setUploadPrice(e.target.value)}
                                placeholder="e.g., 49.00"
                                className="w-full bg-black border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700"
                              />
                            </div>

                            {/* Category selector */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-neutral-400 block pb-1">Asset Category</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {["Architectural", "Interior Design", "Product Design", "Marketing Videos"].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setUploadCat(cat)}
                                    className={`py-2 text-[10px] font-semibold font-mono rounded-lg border transition-all cursor-pointer ${
                                      uploadCat === cat 
                                        ? "bg-white text-black border-white" 
                                        : "bg-transparent text-neutral-400 border-white/5 hover:border-white/10"
                                    }`}
                                  >
                                    {cat.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Description textbox */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-neutral-400">Geometric Description Details</label>
                              <textarea 
                                value={uploadDesc}
                                onChange={(e) => setUploadDesc(e.target.value)}
                                placeholder="Detail mesh structure, triangles count, face normals..."
                                rows={3}
                                className="w-full bg-black border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700 resize-none"
                              />
                            </div>

                            {/* Solid File Drop Area */}
                            <div 
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors relative ${
                                dragActive ? "border-[#00FAFF] bg-sky-950/20" : "border-white/10 hover:border-white/20"
                              }`}
                            >
                              <UploadCloud className="w-8 h-8 text-neutral-500 mx-auto stroke-[1.5]" />
                              
                              {uploadFile ? (
                                <div className="mt-2">
                                  <p className="text-xs font-mono text-emerald-400 font-semibold truncate max-w-[300px] mx-auto flex items-center justify-center gap-1.5">
                                    <Check className="w-4 h-4" />
                                    {uploadFile.name}
                                  </p>
                                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                  
                                  <button
                                    type="button"
                                    onClick={() => setUploadFile(null)}
                                    className="text-[10px] text-red-400 hover:underline mt-2 font-mono"
                                  >
                                    RESET FILE
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-2">
                                  <p className="text-xs font-mono text-neutral-300">Drag & drop your 3D Asset or <label className="text-[#00FAFF] underline cursor-pointer hover:text-sky-300">browse<input type="file" onChange={handleFileChange} className="hidden" accept=".glb,.obj,.gltf" /></label></p>
                                  <p className="text-[10px] text-neutral-500 font-mono mt-1">Acceptable types: .glb, .obj, .gltf (Max 50MB)</p>
                                </div>
                              )}
                            </div>

                            <button
                              type="submit"
                              disabled={uploadLoading}
                              className="w-full py-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                            >
                              <UploadCloud className="w-4 h-4" />
                              <span>{uploadLoading ? "Uploading Asset package..." : "Commit Asset to Server"}</span>
                            </button>

                            {uploadProgress && (
                              <p className="text-[10px] font-mono text-sky-400 mt-2 text-center">
                                {uploadProgress}
                              </p>
                            )}

                          </form>
                        </div>

                        {/* Column Right: List of registered subscribers & Assets manager list (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                          
                          {/* Purge/Delete Assets List */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5" />
                              Active Server Files ({assets.length})
                            </h4>

                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {assets.map((a) => (
                                <div key={a.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                                  <div className="min-w-0">
                                    <p className="text-xs font-mono text-white truncate max-w-[170px] font-semibold">{a.title}</p>
                                    <p className="text-[9px] text-neutral-500 font-mono">{a.fileFormat.toUpperCase().replace(".", "")} • {a.fileSize} • {a.downloadCount} dl</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => purgeAsset(a.id)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-colors"
                                    title="Purge model from backend Storage"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              {assets.length === 0 && (
                                <p className="text-[11px] font-mono text-neutral-600 italic">No custom assets uploaded yet.</p>
                              )}
                            </div>
                          </div>

                          {/* Live Subscribers Panel */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-neutral-300" />
                              Registered Subscribers ({subscribers.length})
                            </h4>

                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                              {subscribers.map((subs, idx) => (
                                <div key={idx} className="p-2.5 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[10px]">
                                  <span className="text-neutral-300 truncate max-w-[150px]">{subs.email}</span>
                                  <span className="text-neutral-500">{new Date(subs.timestamp).toLocaleDateString()}</span>
                                </div>
                              ))}
                              {subscribers.length === 0 && (
                                <p className="text-[11px] font-mono text-neutral-600 italic">No subscriber entries captured.</p>
                              )}
                            </div>
                          </div>

                          {/* Quick Admin Dev Tip */}
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                            <Info className="w-4 h-4 text-[#00FAFF] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 block uppercase font-bold">Admin Pipeline Info</span>
                              <p className="text-[11px] text-neutral-400 font-light mt-0.5 leading-normal">
                                Authenticating unlocks real multi-part network uploads. Files are written securely inside `./uploads/` directory on the server.
                              </p>
                            </div>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Floating Basket Trigger */}
      {basket.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsBasketOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.45)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] flex items-center justify-center cursor-pointer font-bold border border-white"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-2.5 -right-2.5 bg-[#00FAFF] text-black text-[10px] font-mono font-extrabold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {basket.length}
            </span>
          </div>
        </motion.button>
      )}

      {/* Basket Slide-Out Drawer Overlay and Container */}
      <AnimatePresence>
        {isBasketOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessingPayment) setIsBasketOpen(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-neutral-950 border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden z-10 text-white"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#00FAFF]" />
                  <span className="font-bold text-lg tracking-tight font-display">Design Basket</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBasketOpen(false)}
                  disabled={isProcessingPayment}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Contents Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {paymentCompleted ? (
                    /* SUCCESS SCREEN */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-8 space-y-6 flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce select-none">
                        <Check className="w-8 h-8 stroke-[3.5]" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-display tracking-tight text-white animate-pulse">Payment Authorized!</h3>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm mx-auto">
                          A confirmation receipt has been dispatched to <span className="font-mono text-[#00FAFF] font-semibold">{clientEmail}</span>. Your premium 3D design pipeline parameters are unlocked.
                        </p>
                      </div>

                      <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-left space-y-3.5">
                        <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block border-b border-white/5 pb-2 font-bold select-none">Unlocked Downloads Vault</span>
                        
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {activeDisplayList.filter(a => purchasedAssetIds.includes(a.id)).map((asset) => (
                            <div key={asset.id} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4 font-mono text-[10px]">
                              <div className="min-w-0">
                                <p className="text-white truncate max-w-[170px] font-semibold">{asset.title}</p>
                                <p className="text-neutral-500">{asset.fileSize} / {asset.fileFormat.toUpperCase()}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => triggerAssetDownload(asset)}
                                className="inline-flex items-center gap-1 bg-white hover:bg-neutral-200 text-black px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer shadow-md shrink-0"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={resetPaymentSuccess}
                        className="w-full py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl cursor-pointer transition-transform duration-200 active:scale-95"
                      >
                        Complete Order
                      </button>
                    </motion.div>
                  ) : basket.length === 0 ? (
                    /* EMPTY VIEW */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 font-mono space-y-4"
                    >
                      <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto stroke-[1.2]" />
                      <div>
                        <p className="text-sm font-semibold text-neutral-400">Basket is empty</p>
                        <p className="text-xs text-neutral-600 font-light mt-1">Select premium items from the repository grid above.</p>
                      </div>
                    </motion.div>
                  ) : (
                    /* ITEMS IN BASKET & CHECKOUT FORM */
                    <motion.div
                      key="basket-items"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Basket list */}
                      <div className="space-y-2.5">
                        <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block font-bold">Selected Items ({basket.length})</span>
                        
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {basket.map((item) => (
                            <div key={item.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-mono text-white truncate max-w-[200px] font-bold">{item.title}</p>
                                <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{item.fileFormat.toUpperCase()} • {item.fileSize}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-mono text-[#00FAFF] font-semibold">${(item.price || 0).toFixed(2)}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFromBasket(item.id)}
                                  className="p-1 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Math Summary */}
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 text-xs font-mono">
                        <div className="flex justify-between text-neutral-400">
                          <span>Subtotal</span>
                          <span>${basket.reduce((total, asset) => total + (asset.price || 0), 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Clearing Surcharge</span>
                          <span>$0.00</span>
                        </div>
                        <div className="border-t border-white/5 pt-2 flex justify-between text-white font-bold text-sm">
                          <span>Total</span>
                          <span className="text-[#00FAFF]">${basket.reduce((total, asset) => total + (asset.price || 0), 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block font-bold">Select Settlement Medium</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`py-2 px-3 rounded-xl border font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === "card"
                                ? "bg-white text-black border-white"
                                : "bg-black/20 text-neutral-400 border-white/5 hover:border-white/12"
                            }`}
                          >
                            <span className="text-xs">💳 Credit Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("paypal")}
                            className={`py-2 px-3 rounded-xl border font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === "paypal"
                                ? "bg-white text-black border-white"
                                : "bg-black/20 text-neutral-400 border-white/5 hover:border-white/12"
                            }`}
                          >
                            <span className="text-xs">🅿️ PayPal</span>
                          </button>
                        </div>
                      </div>

                      {/* Active Form */}
                      <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                        
                        {/* Billing Email */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400">Dispatch Receipt Email</label>
                          <input
                            type="email"
                            required
                            value={billingEmail}
                            onChange={(e) => setBillingEmail(e.target.value)}
                            placeholder="recipient@domain.com"
                            className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700"
                          />
                        </div>

                        {paymentMethod === "card" ? (
                          /* CREDIT CARD FIELDS */
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-neutral-400">Cardholder Full Name</label>
                              <input
                                type="text"
                                required
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                placeholder="WENDELL OCAMPO"
                                className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700 uppercase"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-neutral-400">Cardholder Number</label>
                              <input
                                type="text"
                                required
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4000 1234 5678 9010"
                                className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-neutral-400">Expiry (MM/YY)</label>
                                <input
                                  type="text"
                                  required
                                  value={cardExpiry}
                                  onChange={handleExpiryChange}
                                  placeholder="12/28"
                                  maxLength={5}
                                  className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700 text-center"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-neutral-400">CVC Code</label>
                                <input
                                  type="password"
                                  required
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                  placeholder="•••"
                                  maxLength={4}
                                  className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700 text-center"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* PAYPAL FIELDS */
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-mono text-neutral-400">PayPal Registered Email</label>
                            <input
                              type="email"
                              required
                              value={paypalEmail}
                              onChange={(e) => setPaypalEmail(e.target.value)}
                              placeholder="paypal-buyer@personal.com"
                              className="w-full bg-black border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-white/20 placeholder:text-neutral-700"
                            />
                            <span className="text-[9px] text-neutral-500 block mt-1 font-mono leading-normal select-none">
                              🔒 Handshake will complete securely inside simulated sandbox layout.
                            </span>
                          </div>
                        )}

                        {paymentError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-xl flex items-start gap-2 text-red-400 select-none">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-mono leading-normal">{paymentError}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isProcessingPayment}
                          className="w-full py-3 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 font-sans"
                        >
                          {isProcessingPayment ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Clearing Parameters...</span>
                            </>
                          ) : (
                            <>
                              <span>Authorize Settlement</span>
                              <span>→</span>
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
