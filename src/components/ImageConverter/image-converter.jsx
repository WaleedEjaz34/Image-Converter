// import { useState, useEffect } from "react";
// import imageCompression from "browser-image-compression";
// import JSZip from "jszip"; // npm install jszip
// import { saveAs } from "file-saver"; // npm install file-saver
// import { FiImage, FiDownload, FiRefreshCw, FiX, FiShield, FiZap, FiCheckCircle, FiLock, FiUser, FiLayers } from "react-icons/fi";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ImageConverter = () => {
//     // Auth State
//     const [user, setUser] = useState(null);
//     const [showAuthModal, setShowAuthModal] = useState(false);

//     // File State
//     const [files, setFiles] = useState([]); // Array to handle 1 or many
//     const [isConverting, setIsConverting] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const [format, setFormat] = useState("png");
//     const [results, setResults] = useState([]);
//     const [progress, setProgress] = useState(0);

//     const notifyUpload = (count) => toast.success(`${count} file(s) uploaded!`);

//     // --- AUTH LOGIC ---
//     const handleLogin = () => {
//         setUser({ name: "Pro User" });
//         setShowAuthModal(false);
//         toast.success("Pro Features Unlocked!");
//     };

//     const processFiles = (incomingFiles) => {
//         const fileArray = Array.from(incomingFiles).filter(f => f.type.startsWith("image/"));

//         // CHECK: If more than 1 file and no user, block and show Modal
//         if (fileArray.length > 1 && !user) {
//             setShowAuthModal(true);
//             return;
//         }

//         setFiles(fileArray);
//         setResults([]);
//         notifyUpload(fileArray.length);
//     };

//     const handleFileChange = (e) => processFiles(e.target.files);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         processFiles(e.dataTransfer.files);
//     };

//     const convertImages = async () => {
//         if (files.length === 0) return;
//         setIsConverting(true);
//         const convertedItems = [];

//         try {
//             for (let i = 0; i < files.length; i++) {
//                 const options = {
//                     maxSizeMB: 2,
//                     useWebWorker: true,
//                     fileType: `image/${format}`,
//                     onProgress: (p) => setProgress(p),
//                 };

//                 const compressedBlob = await imageCompression(files[i], options);
//                 convertedItems.push({
//                     url: URL.createObjectURL(compressedBlob),
//                     name: `${files[i].name.split('.')[0]}.${format}`,
//                     blob: compressedBlob
//                 });
//             }
//             setResults(convertedItems);
//             setFiles([]); // Clear queue after success
//             toast.success("Conversion complete!");
//         } catch (error) {
//             toast.error("Conversion failed.");
//         } finally {
//             setIsConverting(false);
//         }
//     };

//     const downloadAll = async () => {
//         if (results.length === 1) {
//             saveAs(results[0].blob, results[0].name);
//         } else {
//             const zip = new JSZip();
//             results.forEach(res => zip.file(res.name, res.blob));
//             const content = await zip.generateAsync({ type: "blob" });
//             saveAs(content, "converted_images.zip");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
//             {/* --- NAVBAR --- */}
//             <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                         <div className="bg-blue-600 p-2 rounded-lg"><FiRefreshCw className="text-white" /></div>
//                         <span className="text-xl font-bold text-blue-600">Cloud2Convert</span>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         {!user ? (
//                             <button onClick={() => setShowAuthModal(true)} className="text-sm font-semibold text-gray-600 hover:text-blue-600">Sign In</button>
//                         ) : (
//                             <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"><FiUser /> Pro Account</span>
//                         )}
//                     </div>
//                 </div>
//             </nav>

//             <header className="pt-16 pb-8 px-4 text-center">
//                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">Image Converter</h1>
//                 <p className="text-gray-500 max-w-xl mx-auto">Free for single files. <span className="text-blue-600 font-bold">Sign in</span> to convert batches.</p>
//             </header>

//             <main className="max-w-4xl mx-auto px-4 pb-20">
//                 <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 relative">

//                     {/* --- DROPZONE --- */}
//                     {!isConverting && results.length === 0 && files.length === 0 && (
//                         <div
//                             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//                             onDragLeave={() => setIsDragging(false)}
//                             onDrop={handleDrop}
//                         >
//                             <label htmlFor="file-upload" className={`w-full h-72 border-2 border-dashed rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}>
//                                 <div className="text-center">
//                                     <FiImage size={48} className="text-blue-600 mx-auto mb-4" />
//                                     <p className="text-xl font-semibold">Drop image(s) here</p>
//                                     <p className="text-sm text-gray-400 mt-2">Single file is Free. Batch requires Pro.</p>
//                                 </div>
//                                 <input id="file-upload" type="file" multiple={!!user} accept="image/*" onChange={handleFileChange} className="hidden" />
//                             </label>
//                         </div>
//                     )}

//                     {/* --- FILE QUEUE / SETTINGS --- */}
//                     {files.length > 0 && (
//                         <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="font-bold">{files.length} File(s) Selected</h3>
//                                 <button onClick={() => setFiles([])} className="text-red-500"><FiX size={20} /></button>
//                             </div>
//                             <div className="flex gap-4 items-center">
//                                 <select value={format} onChange={(e) => setFormat(e.target.value)} className="bg-white border p-2 rounded-lg outline-none">
//                                     <option value="png">PNG</option>
//                                     <option value="webp">WebP</option>
//                                     <option value="jpeg">JPG</option>
//                                 </select>
//                                 <button onClick={convertImages} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
//                                     {files.length > 1 ? `Convert Batch (Pro)` : 'Convert Image'}
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* --- RESULTS --- */}
//                     {results.length > 0 && (
//                         <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-100">
//                             <FiCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
//                             <h2 className="text-2xl font-bold mb-6">Success!</h2>
//                             <button onClick={downloadAll} className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-green-700">
//                                 <FiDownload /> {results.length > 1 ? 'Download ZIP' : 'Download Image'}
//                             </button>
//                             <button onClick={() => setResults([])} className="mt-4 text-sm text-gray-500 underline">Convert more</button>
//                         </div>
//                     )}

//                     {isConverting && (
//                         <div className="py-10 text-center">
//                             <FiRefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
//                             <p className="font-bold">Converting... {Math.round(progress)}%</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Features Section */}
//                 <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
//                     <div className="text-center">
//                         <FiZap className="text-orange-500 text-3xl mx-auto mb-3" />
//                         <h4 className="font-bold">Instant</h4>
//                         <p className="text-sm text-gray-500">Local browser conversion.</p>
//                     </div>
//                     <div className="text-center">
//                         <FiShield className="text-blue-500 text-3xl mx-auto mb-3" />
//                         <h4 className="font-bold">Secure</h4>
//                         <p className="text-sm text-gray-500">Files never touch our servers.</p>
//                     </div>
//                     <div className="text-center">
//                         <FiLayers className="text-purple-500 text-3xl mx-auto mb-3" />
//                         <h4 className="font-bold">Batch Mode</h4>
//                         <p className="text-sm text-gray-500">Convert up to 50 files at once.</p>
//                     </div>
//                 </div>
//             </main>

//             {/* --- AUTH MODAL --- */}
//             {showAuthModal && (
//                 <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
//                     <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
//                         <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                             <FiLock className="text-blue-600 text-2xl" />
//                         </div>
//                         <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
//                         <p className="text-gray-500 mb-6">Batch conversion is a Pro feature. Sign in to convert multiple images at once.</p>
//                         <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-3 flex items-center justify-center gap-2">
//                             Continue with Google
//                         </button>
//                         <button onClick={() => setShowAuthModal(false)} className="text-sm text-gray-400 hover:text-gray-600 underline">Maybe later</button>
//                     </div>
//                 </div>
//             )}
//             <ToastContainer position="bottom-right" />
//         </div>
//     );
// };

// export default ImageConverter;






import { useState, useRef, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
    FiUploadCloud, FiDownload, FiRefreshCw, FiX, FiShield, FiZap,
    FiLayers, FiLock, FiUnlock, FiImage, FiCheckCircle, FiAlertCircle,
    FiSliders, FiMaximize2, FiPackage, FiArrowRight, FiGrid, FiMenu,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    bg: "#07070E",
    surface: "#0F0F1C",
    card: "#16162B",
    card2: "#1D1D35",
    border: "#2A2A4A",
    border2: "#3A3A5C",
    accent: "#6EE7B7",
    accent2: "#F59E0B",
    accent3: "#818CF8",
    text: "#F1F5F9",
    muted: "#8892A4",
    muted2: "#4A5568",
    danger: "#F87171",
    success: "#34D399",
};

const FORMATS = [
    { value: "jpeg", label: "JPEG — Balanced", lossy: true },
    { value: "png", label: "PNG — Lossless", lossy: false },
    { value: "webp", label: "WebP — Modern", lossy: true },
    { value: "avif", label: "AVIF — Smallest", lossy: true },
    { value: "bmp", label: "BMP — Uncompressed", lossy: false },
    { value: "gif", label: "GIF — Indexed", lossy: false },
];

const STRIP_ITEMS = [
    { label: "JPG → PNG", color: C.accent }, { label: "PNG → WebP", color: C.accent3 },
    { label: "WebP → AVIF", color: C.accent2 }, { label: "AVIF → JPEG", color: C.danger },
    { label: "BMP → PNG", color: C.accent }, { label: "GIF → WebP", color: C.accent3 },
    { label: "TIFF → JPEG", color: C.accent2 }, { label: "PNG → ICO", color: C.danger },
    { label: "HEIC → JPG", color: C.accent }, { label: "JPG → AVIF", color: C.accent3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
let _id = 0;
const uid = () => ++_id;

const fmtSize = (b) => {
    if (!b && b !== 0) return "—";
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(2)} MB`;
};

const getMime = (fmt) => (fmt === "jpg" ? "image/jpeg" : `image/${fmt}`);
const getExt = (fmt) => (fmt === "jpeg" ? "jpg" : fmt);

// ─── Conversion Logic ─────────────────────────────────────────────────────────
const canvasConvert = (file, format, qualityFraction, maxW, maxH) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            let w = img.naturalWidth, h = img.naturalHeight;
            const ratio = h / w;
            if (maxW && w > maxW) { w = maxW; h = Math.round(w * ratio); }
            if (maxH && h > maxH) { h = maxH; w = Math.round(h / ratio); }
            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (["jpeg", "bmp"].includes(format)) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, w, h);
            }
            ctx.drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);
            const lossy = ["jpeg", "webp", "avif"].includes(format);
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed"))),
                getMime(format),
                lossy ? qualityFraction : undefined
            );
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Load failed")); };
        img.src = url;
    });

const preprocessImageFull = async (file, quality) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (["heic", "heif"].includes(ext)) {
        try {
            const heic2anyModule = await import("heic2any");
            const heic2any = heic2anyModule.default || heic2anyModule;
            const converted = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: quality / 100,
            });
            return Array.isArray(converted) ? converted[0] : converted;
        } catch (err) {
            console.error("HEIC preprocessor error:", err);
            throw new Error("Could not decode HEIC image. Please verify it is a valid HEIC/HEIF photo.");
        }
    }
    if (["tiff", "tif"].includes(ext)) {
        try {
            const UTIFModule = await import("utif");
            const UTIF = UTIFModule.default || UTIFModule;
            const buffer = await file.arrayBuffer();
            const ifds = UTIF.decode(buffer);
            UTIF.decodeImage(buffer, ifds[0]);
            const rgba = UTIF.toRGBA8(ifds[0]);

            const canvas = document.createElement("canvas");
            canvas.width = ifds[0].width;
            canvas.height = ifds[0].height;
            const ctx = canvas.getContext("2d");
            const imgData = ctx.createImageData(ifds[0].width, ifds[0].height);
            imgData.data.set(rgba);
            ctx.putImageData(imgData, 0, 0);

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("TIFF conversion failed"));
                }, "image/png");
            });
        } catch (err) {
            console.error("TIFF preprocessor error:", err);
            throw new Error("Could not decode TIFF image. Please verify it is a valid TIFF photo.");
        }
    }
    return file;
};

const convertFile = async (file, format, quality, maxW, maxH, onProgress) => {
    const useBIC = ["jpeg", "png", "webp"].includes(format);
    if (useBIC) {
        const opts = {
            maxSizeMB: 50,
            useWebWorker: true,
            fileType: getMime(format),
            initialQuality: quality / 100,
            onProgress,
        };
        const cap = Math.max(maxW || 0, maxH || 0);
        if (cap) opts.maxWidthOrHeight = cap;
        return imageCompression(file, opts);
    }
    onProgress(50);
    const blob = await canvasConvert(file, format, quality / 100, maxW || null, maxH || null);
    onProgress(100);
    return blob;
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; color: ${C.text}; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.surface}; }
    ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 2px; }
    input[type=range] { accent-color: ${C.accent}; cursor: pointer; }
    input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
    select option { background: ${C.card}; }

    @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
    @keyframes scrollFmts { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes barShine { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

    .pf-spin { animation: spin .9s linear infinite; }
    .pf-fadeup { animation: fadeUp .4s ease both; }
    .pf-strip-track { animation: scrollFmts 20s linear infinite; }
    .pf-strip-track:hover { animation-play-state: paused; }
    .pf-hero-grid {
      background-image: linear-gradient(${C.border} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.border} 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
    }
    .pf-feat-card:hover { background: ${C.card2} !important; }
    .pf-dropzone:hover, .pf-dropzone.drag-over { border-color: ${C.accent} !important; background: rgba(110,231,183,.04) !important; }
    .pf-dropzone.drag-over { transform: scale(1.01); }
    .pf-nav-link:hover { color: ${C.accent} !important; }
    .pf-btn-ghost:hover { border-color: ${C.accent} !important; color: ${C.accent} !important; }
    .pf-btn-primary:hover { opacity: .85; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(110,231,183,.28); }
    .pf-convert-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(110,231,183,.28); }
    .pf-dl-btn:hover { background: rgba(52,211,153,.12) !important; }
    .pf-clear-btn:hover { border-color: ${C.danger} !important; color: ${C.danger} !important; }
    .pf-fi-dl:hover { background: ${C.accent} !important; color: #07070E !important; }
    .pf-fi-rm:hover { background: rgba(248,113,113,.12) !important; color: ${C.danger} !important; }
    .pf-lock-btn:hover { border-color: ${C.accent} !important; }
    .pf-tab:hover:not(.active) { color: ${C.text} !important; }

    /* Override Toastify */
    .Toastify__toast { background: ${C.card2} !important; color: ${C.text} !important; border: 1px solid ${C.border2}; font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
    .Toastify__progress-bar { background: ${C.accent} !important; }
    .Toastify__close-button { color: ${C.muted} !important; }

    .pf-thumb-hover {
        position: absolute;
        inset: 0;
        background: rgba(7,7,14,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
    }
    .pf-thumb-hover:hover {
        opacity: 1 !important;
    }

    /* --- MOBILE RESPONSIVENESS --- */
    @media (max-width: 768px) {
        .pf-nav { padding: 0 16px !important; }
        .pf-nav-links { display: none !important; }
        .pf-mobile-menu-btn { display: flex !important; }
        .pf-hero-title { font-size: clamp(40px, 10vw, 52px) !important; }
        .pf-section { padding: 60px 16px !important; }
        .pf-grid-3 { grid-template-columns: 1fr !important; gap: 48px !important; }
        .pf-step-line { display: none !important; }
        .pf-settings-row { flex-direction: column !important; padding: 16px !important; gap: 16px !important; }
        .pf-action-bar { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
        .pf-action-bar button { width: 100% !important; justify-content: center !important; margin-left: 0 !important; }
        .pf-tab { padding: 12px 10px !important; font-size: 11px !important; }
        .pf-tab-extra { display: none !important; }
        .pf-hero-stats { flex-direction: column !important; gap: 32px !important; }
        .pf-file-row { flex-wrap: wrap !important; }
        .pf-file-status { order: 2; margin-left: auto; }
        .pf-file-actions { order: 3; display: flex; gap: 8px; width: 100%; justify-content: flex-end; margin-top: 8px; }
        .pf-dropzone-inner { padding: 32px 16px !important; }
    }
  `}</style>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ onConvertClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="pf-nav" style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                height: 64, display: "flex", alignItems: "center", padding: "0 40px",
                background: "rgba(7,7,14,.88)", backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${C.border}`,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, background: C.accent, borderRadius: 7,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <FiGrid size={17} color="#07070E" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.text }}>
                        Pixel<span style={{ color: C.accent }}>Forge</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="pf-nav-links" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 32 }}>
                    {["Features", "How it works", "Converter"].map((lbl) => (
                        <a
                            key={lbl}
                            href={`#${lbl.toLowerCase().replace(/ /g, "-")}`}
                            className="pf-nav-link"
                            style={{ color: C.muted, textDecoration: "none", fontSize: 13, letterSpacing: ".04em", transition: "color .2s" }}
                        >{lbl}</a>
                    ))}
                    <button
                        onClick={onConvertClick}
                        style={{
                            background: C.accent, color: "#07070E", border: "none",
                            padding: "8px 20px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity .2s",
                        }}
                    >Convert Now</button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="pf-mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        marginLeft: "auto", background: "transparent", border: "none",
                        color: C.text, cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center"
                    }}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div style={{
                    position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
                    background: "rgba(7,7,14,.98)", backdropFilter: "blur(16px)",
                    borderBottom: `1px solid ${C.border}`, padding: "24px 20px",
                    display: "flex", flexDirection: "column", gap: 20,
                    animation: "fadeUp 0.2s ease"
                }}>
                    {["Features", "How it works", "Converter"].map((lbl) => (
                        <a
                            key={lbl}
                            href={`#${lbl.toLowerCase().replace(/ /g, "-")}`}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ color: C.text, textDecoration: "none", fontSize: 16, fontWeight: 500, padding: "8px 0", borderBottom: `1px solid ${C.border2}` }}
                        >{lbl}</a>
                    ))}
                    <button
                        onClick={() => { setIsMenuOpen(false); onConvertClick(); }}
                        style={{
                            background: C.accent, color: "#07070E", border: "none",
                            padding: "14px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8
                        }}
                    >Convert Now</button>
                </div>
            )}
        </>
    );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ onStart }) => (
    <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "100px 24px 60px", position: "relative", overflow: "hidden", textAlign: "center",
    }}>
        {/* Grid background */}
        <div className="pf-hero-grid" style={{ position: "absolute", inset: 0, opacity: .35, pointerEvents: "none" }} />
        {/* Glow */}
        <div style={{
            position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
            width: 640, height: 320, pointerEvents: "none",
            background: "radial-gradient(ellipse, rgba(110,231,183,.13) 0%, transparent 70%)",
        }} />

        {/* Badge */}
        <div className="pf-fadeup" style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
            background: "rgba(110,231,183,.1)", border: "1px solid rgba(110,231,183,.25)",
            color: C.accent, padding: "6px 18px", borderRadius: 40, fontSize: 12, letterSpacing: ".08em",
            position: "relative",
        }}>
            <span style={{ width: 6, height: 6, background: C.accent, borderRadius: "50%", animation: "pulseDot 2s infinite" }} />
            No upload · 100% browser · Zero servers
        </div>

        {/* Headline */}
        <h1 className="pf-fadeup pf-hero-title" style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(52px, 8vw, 96px)", lineHeight: 1.0,
            letterSpacing: "-.02em", marginBottom: 24, position: "relative",
        }}>
            Transform Any Image
            <span style={{ color: C.accent, display: "block" }}>Instantly.</span>
        </h1>

        <p className="pf-fadeup" style={{
            fontSize: "clamp(14px, 2vw, 17px)", color: C.muted, maxWidth: 540,
            lineHeight: 1.85, marginBottom: 48, position: "relative",
        }}>
            The fastest, most private image converter. Convert, compress, and resize
            images entirely in your browser — no server, no account required.
        </p>

        <div className="pf-fadeup" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <button
                className="pf-btn-primary"
                onClick={onStart}
                style={{
                    background: C.accent, color: "#07070E", border: "none",
                    padding: "14px 32px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                }}
            >Start Converting Free</button>
            <a
                href="#features"
                className="pf-btn-ghost"
                style={{
                    background: "transparent", color: C.text,
                    border: `1px solid ${C.border2}`, padding: "14px 32px", borderRadius: 8,
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, cursor: "pointer",
                    transition: "all .2s", textDecoration: "none", display: "inline-flex", alignItems: "center",
                }}
            >See All Features</a>
        </div>

        {/* Stats row */}
        <div className="pf-fadeup pf-hero-stats" style={{
            display: "flex", gap: 48, marginTop: 64, position: "relative",
            borderTop: `1px solid ${C.border}`, paddingTop: 40, flexWrap: "wrap", justifyContent: "center",
        }}>
            {[
                { num: "12M+", lbl: "IMAGES CONVERTED" },
                { num: "8", lbl: "OUTPUT FORMATS" },
                { num: "0 KB", lbl: "DATA UPLOADED" },
                { num: "50+", lbl: "BATCH FILES" },
            ].map(({ num, lbl }) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: C.text }}>{num}</div>
                    <div style={{ fontSize: 11, color: C.muted, letterSpacing: ".1em", marginTop: 4 }}>{lbl}</div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Format Strip ─────────────────────────────────────────────────────────────
const FormatStrip = () => {
    const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS];
    return (
        <div style={{
            background: C.surface, borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`, padding: "28px 0", overflow: "hidden",
        }}>
            <div className="pf-strip-track" style={{ display: "flex", gap: 20, width: "max-content" }}>
                {doubled.map((f, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: C.card, border: `1px solid ${C.border}`,
                        padding: "8px 20px", borderRadius: 40, whiteSpace: "nowrap", fontSize: 13, color: C.text,
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                        {f.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Features ─────────────────────────────────────────────────────────────────
const feats = [
    { icon: FiUploadCloud, title: "Drag & Drop Upload", desc: "Drop any image directly or click to browse. Supports drag-and-drop with intelligent file filtering for image-only files.", tag: null },
    { icon: FiLayers, title: "Batch Conversion", desc: "Process up to 50 images simultaneously with per-file progress tracking. Convert entire design projects in seconds.", tag: "BATCH FREE" },
    { icon: FiImage, title: "8 Output Formats", desc: "Convert between PNG, JPEG, WebP, AVIF, BMP, GIF, ICO, and TIFF. Format-specific quality controls for each type.", tag: null },
    { icon: FiSliders, title: "Smart Compression", desc: "Adjustable quality slider with real-time size estimation. See exactly how much space you save before downloading.", tag: null },
    { icon: FiMaximize2, title: "Resize & Scale", desc: "Set exact pixel dimensions with locked aspect ratio. Resize while converting without any quality loss beyond your chosen setting.", tag: null },
    { icon: FiShield, title: "100% Private", desc: "Every conversion happens in your browser using the Canvas API and Web Workers. No image data ever leaves your device.", tag: "ZERO UPLOAD" },
];

const Features = () => (
    <section id="features" className="pf-section" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 11, letterSpacing: ".15em", color: C.accent, marginBottom: 16 }}>CAPABILITIES</div>
            <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 16,
            }}>
                Everything you need,<br />
                <span style={{ color: C.accent }}>nothing you don't.</span>
            </h2>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8, maxWidth: 520, marginBottom: 64 }}>
                Built for designers, developers, and anyone who works with images daily.
            </p>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 1, background: C.border, border: `1px solid ${C.border}`,
                borderRadius: 14, overflow: "hidden",
            }}>
                {feats.map(({ icon: Icon, title, desc, tag }) => (
                    <div
                        key={title}
                        className="pf-feat-card"
                        style={{ background: C.card, padding: "36px 32px", transition: "background .2s", cursor: "default" }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 8, marginBottom: 20,
                            background: "rgba(110,231,183,.1)", border: "1px solid rgba(110,231,183,.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Icon size={20} color={C.accent} strokeWidth={1.8} />
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, letterSpacing: "-.01em" }}>{title}</h3>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{desc}</p>
                        {tag && (
                            <span style={{
                                display: "inline-block", marginTop: 12,
                                background: "rgba(245,158,11,.1)", color: C.accent2,
                                border: "1px solid rgba(245,158,11,.2)", fontSize: 10,
                                padding: "2px 9px", borderRadius: 4, letterSpacing: ".06em",
                            }}>{tag}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ─── How It Works ─────────────────────────────────────────────────────────────
const HowItWorks = () => (
    <section id="how-it-works" className="pf-section" style={{
        padding: "100px 24px", background: C.surface,
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
    }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 11, letterSpacing: ".15em", color: C.accent, marginBottom: 16 }}>PROCESS</div>
            <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 64,
            }}>
                Three steps to<br /><span style={{ color: C.accent }}>perfect images.</span>
            </h2>
            <div className="pf-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
                <div className="pf-step-line" style={{
                    position: "absolute", top: 27, left: "10%", right: "10%", height: 1,
                    background: `linear-gradient(90deg, transparent, ${C.border2}, transparent)`,
                }} />
                {[
                    { n: "1", title: "Drop Your Images", body: "Drag and drop one image or an entire batch. All formats accepted — JPEG, PNG, WebP, AVIF, HEIC, BMP, GIF." },
                    { n: "2", title: "Configure Settings", body: "Choose output format, adjust quality, resize dimensions. PixelForge shows you file size estimates instantly." },
                    { n: "3", title: "Download Results", body: "Download individually or as a ZIP archive. Your originals remain untouched — files are never overwritten." },
                ].map(({ n, title, body }) => (
                    <div key={n} style={{ textAlign: "center", position: "relative" }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: "50%",
                            background: C.card, border: `1px solid ${C.border2}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 24px", position: "relative", zIndex: 1,
                            fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.accent,
                        }}>{n}</div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{body}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ─── File Item Row ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    idle: { bg: "rgba(255,255,255,.05)", color: C.muted },
    converting: { bg: "rgba(110,231,183,.1)", color: C.accent },
    done: { bg: "rgba(52,211,153,.1)", color: C.success },
    error: { bg: "rgba(248,113,113,.1)", color: C.danger },
};

const FileItemRow = ({ item, onRemove, onDownload, onCompare, format, activeTab }) => {
    const s = STATUS_STYLES[item.status] || STATUS_STYLES.idle;
    const saving = item.newSize && item.origSize
        ? (((item.origSize - item.newSize) / item.origSize) * 100).toFixed(1)
        : null;

    return (
        <div className="pf-file-row" style={{
            display: "flex", alignItems: "center", gap: 14,
            background: item.status === "done" ? "rgba(52,211,153,.03)" : C.card2,
            border: `1px solid ${item.status === "done" ? "rgba(52,211,153,.3)" : item.status === "error" ? "rgba(248,113,113,.3)" : C.border}`,
            borderRadius: 14, padding: "14px 18px", transition: "all .2s",
        }}>
            {/* Thumbnail */}
            <div
                onClick={() => item.status === "done" && onCompare(item)}
                style={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: item.status === "done" ? "pointer" : "default",
                    flexShrink: 0,
                    border: `1px solid ${C.border}`
                }}
                title={item.status === "done" ? "Click to compare original vs converted" : ""}
            >
                {item.thumbUrl ? (
                    <img
                        src={item.thumbUrl}
                        alt={item.file.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <div style={{
                        width: "100%", height: "100%", background: C.card,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: C.muted, fontWeight: "bold"
                    }}>
                        {item.file.name.split('.').pop().toUpperCase()}
                    </div>
                )}
                {item.status === "done" && (
                    <div className="pf-thumb-hover">
                        <FiSliders size={14} color={C.accent} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.file.name}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                    {activeTab === 2 ? (
                        <>
                            <span style={{ fontSize: 11, color: C.muted }}>Dimensions: {item.width ? `${item.width} x ${item.height}` : "Unknown"}</span>
                            <span style={{ fontSize: 11, color: C.muted }}>Size: {fmtSize(item.origSize)}</span>
                            <span style={{ fontSize: 11, color: C.muted }}>Type: {item.file.type || "Unknown"}</span>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: 11, color: C.muted }}>Original: {fmtSize(item.origSize)}</span>
                            {item.newSize > 0 && (
                                <span style={{ fontSize: 11, color: saving > 0 ? C.success : C.muted }}>
                                    → {fmtSize(item.newSize)}
                                    {saving > 0 && ` (${saving}% smaller)`}
                                </span>
                            )}
                        </>
                    )}
                </div>
                {/* Progress bar */}
                <div style={{ height: 3, background: C.border, borderRadius: 2, marginTop: 8 }}>
                    <div style={{
                        height: "100%", width: `${item.progress}%`,
                        background: item.status === "error" ? C.danger : C.accent,
                        borderRadius: 2, transition: "width .3s ease",
                    }} />
                </div>
            </div>

            {activeTab !== 2 && (
                <>
                    {/* Status badge */}
                    <span className="pf-file-status" style={{
                        fontSize: 11, letterSpacing: ".06em", padding: "3px 10px", borderRadius: 4,
                        background: s.bg, color: s.color, flexShrink: 0,
                    }}>
                        {item.status === "converting"
                            ? `${Math.round(item.progress)}%`
                            : item.status.toUpperCase()}
                    </span>
                </>
            )}

            <div className="pf-file-actions" style={{ display: "flex", gap: 8 }}>
                {/* Per-file Compare */}
                {activeTab !== 2 && item.status === "done" && item.blob && (
                    <button
                        onClick={() => onCompare(item)}
                        title="Compare Original vs Converted"
                        style={{
                            background: "rgba(129,140,248,.1)", border: "1px solid rgba(129,140,248,.2)",
                            color: C.accent3, width: 32, height: 32, borderRadius: 6,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all .2s",
                        }}
                    >
                        <FiSliders size={14} />
                    </button>
                )}

                {/* Per-file download */}
                {activeTab !== 2 && item.status === "done" && item.blob && (
                    <button
                        className="pf-fi-dl"
                        onClick={() => onDownload(item)}
                        title="Download"
                        style={{
                            background: "rgba(110,231,183,.1)", border: "1px solid rgba(110,231,183,.2)",
                            color: C.accent, width: 32, height: 32, borderRadius: 6,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all .2s",
                        }}
                    >
                        <FiDownload size={14} />
                    </button>
                )}

                {/* Remove */}
                <button
                    className="pf-fi-rm"
                    onClick={() => onRemove(item.id)}
                    title="Remove"
                    style={{
                        background: "transparent", border: "none", color: C.muted2,
                        width: 28, height: 28, borderRadius: 4, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all .2s",
                    }}
                >
                    <FiX size={14} />
                </button>
            </div>
        </div>
    );
};

// ─── Converter Section ────────────────────────────────────────────────────────
const ConverterSection = () => {
    const [activeTab, setActiveTab] = useState(0); // 0: Convert, 1: Resize, 2: Analyze
    const [fileItems, setFileItems] = useState([]);
    const [compareItem, setCompareItem] = useState(null);
    const [format, setFormat] = useState("jpeg");
    const [quality, setQuality] = useState(85);
    const [maxW, setMaxW] = useState("");
    const [maxH, setMaxH] = useState("");
    const [locked, setLocked] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef(null);
    const hasDone = fileItems.some((i) => i.status === "done" && i.blob);
    const hasIdle = fileItems.some((i) => i.status === "idle");
    const isLossy = FORMATS.find((f) => f.value === format)?.lossy ?? true;

    // ── File handling ───────────────────────────────────────────────────────────
    const addFiles = useCallback((rawList) => {
        const valid = Array.from(rawList).filter((f) => {
            const ext = f.name.split('.').pop().toLowerCase();
            const mimeType = f.type.toLowerCase();
            return mimeType.startsWith("image/") ||
                ["heic", "heif", "tiff", "tif"].includes(ext) ||
                mimeType === "image/heic" ||
                mimeType === "image/heif" ||
                mimeType === "image/tiff";
        });
        if (!valid.length) { toast.error("No image files detected."); return; }
        if (valid.length > 50) { toast.error("Maximum 50 files per batch."); return; }

        const newItems = valid.map((file) => {
            const itemId = uid();
            const ext = file.name.split('.').pop().toLowerCase();
            const isHeic = ["heic", "heif"].includes(ext);
            const isTiff = ["tiff", "tif"].includes(ext);

            let thumbUrl = null;
            if (!isHeic && !isTiff && file.type.startsWith("image/")) {
                thumbUrl = URL.createObjectURL(file);
            }

            return {
                id: itemId,
                file,
                status: "idle",
                blob: null,
                origSize: file.size,
                newSize: 0,
                progress: 0,
                thumbUrl,
                originalRenderableUrl: !isHeic && !isTiff ? thumbUrl : null,
            };
        });

        setFileItems((prev) => [...prev, ...newItems]);
        toast.success(`${valid.length} file${valid.length > 1 ? "s" : ""} added`);

        // Trigger background preview generation and metadata extraction
        newItems.forEach(async (item) => {
            const ext = item.file.name.split('.').pop().toLowerCase();
            const isHeic = ["heic", "heif"].includes(ext);
            const isTiff = ["tiff", "tif"].includes(ext);

            if (isHeic || isTiff) {
                try {
                    const previewBlob = await preprocessImageFull(item.file, 90);
                    const url = URL.createObjectURL(previewBlob);
                    const img = new Image();
                    img.onload = () => {
                        setFileItems(prev => prev.map(i => i.id === item.id ? { ...i, thumbUrl: url, originalRenderableUrl: url, width: img.naturalWidth, height: img.naturalHeight } : i));
                    };
                    img.src = url;
                } catch (e) {
                    console.error("Failed to generate preview for HEIC/TIFF", item.file.name, e);
                }
            } else if (item.thumbUrl) {
                const img = new Image();
                img.onload = () => {
                    setFileItems(prev => prev.map(i => i.id === item.id ? { ...i, width: img.naturalWidth, height: img.naturalHeight } : i));
                };
                img.src = item.thumbUrl;
            }
        });
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    const removeItem = (id) => {
        setFileItems((prev) => {
            const item = prev.find((i) => i.id === id);
            if (item?.thumbUrl) URL.revokeObjectURL(item.thumbUrl);
            if (item?.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
            if (item?.originalRenderableUrl && item.originalRenderableUrl !== item.thumbUrl) {
                URL.revokeObjectURL(item.originalRenderableUrl);
            }
            return prev.filter((i) => i.id !== id);
        });
    };

    const clearAll = () => {
        fileItems.forEach((i) => {
            if (i.thumbUrl) URL.revokeObjectURL(i.thumbUrl);
            if (i.convertedUrl) URL.revokeObjectURL(i.convertedUrl);
            if (i.originalRenderableUrl && i.originalRenderableUrl !== i.thumbUrl) {
                URL.revokeObjectURL(i.originalRenderableUrl);
            }
        });
        setFileItems([]);
    };

    // ── Update single item ──────────────────────────────────────────────────────
    const updateItem = (id, patch) =>
        setFileItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

    // ── Conversion ──────────────────────────────────────────────────────────────
    const startConversion = async () => {
        const pending = fileItems.filter((i) => i.status === "idle");
        if (!pending.length) { toast.info("No files left to convert."); return; }

        setIsConverting(true);
        const mw = (activeTab === 1 && maxW) ? parseInt(maxW) : null;
        const mh = (activeTab === 1 && maxH) ? parseInt(maxH) : null;
        let doneCount = 0;

        for (const item of pending) {
            updateItem(item.id, { status: "converting", progress: 10 });
            try {
                let processingFile = item.file;
                const ext = item.file.name.split('.').pop().toLowerCase();
                const isHeic = ["heic", "heif"].includes(ext);
                const isTiff = ["tiff", "tif"].includes(ext);

                if (isHeic || isTiff) {
                    updateItem(item.id, { progress: 30 });
                    processingFile = await preprocessImageFull(item.file, quality);
                }

                updateItem(item.id, { progress: 50 });

                const blob = await convertFile(
                    processingFile, format, quality, mw, mh,
                    (p) => updateItem(item.id, { progress: 50 + (p / 2) })
                );

                const convertedUrl = URL.createObjectURL(blob);
                updateItem(item.id, {
                    status: "done",
                    blob,
                    newSize: blob.size,
                    progress: 100,
                    convertedUrl
                });
                doneCount++;
            } catch (err) {
                console.error("Conversion failed:", err);
                updateItem(item.id, { status: "error", progress: 0 });
                toast.error(`Failed: ${item.file.name}`);
            }
        }

        setIsConverting(false);
        if (doneCount > 0) toast.success(`${doneCount} image${doneCount > 1 ? "s" : ""} converted!`);
    };

    // ── Download single ─────────────────────────────────────────────────────────
    const downloadItem = (item) => {
        if (!item.blob) return;
        const ext = getExt(format);
        const base = item.file.name.replace(/\.[^.]+$/, "");
        saveAs(item.blob, `${base}.${ext}`);
    };

    // ── Download all as ZIP ─────────────────────────────────────────────────────
    const downloadAll = async () => {
        const done = fileItems.filter((i) => i.status === "done" && i.blob);
        if (!done.length) { toast.info("No converted files yet."); return; }
        if (done.length === 1) { downloadItem(done[0]); return; }

        toast.info("Building ZIP archive…");
        const zip = new JSZip();
        const ext = getExt(format);
        done.forEach((item) => {
            const base = item.file.name.replace(/\.[^.]+$/, "");
            zip.file(`${base}.${ext}`, item.blob);
        });
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "pixelforge_converted.zip");
        toast.success("ZIP downloaded!");
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <section id="converter" className="pf-section" style={{ padding: "100px 24px", background: C.surface }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ fontSize: 11, letterSpacing: ".15em", color: C.accent, marginBottom: 16 }}>TOOL</div>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 56px)",
                    fontWeight: 300, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 12,
                }}>The Converter</h2>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8, maxWidth: 520, marginBottom: 48 }}>
                    Drop your images, configure your settings, and convert — all in your browser.
                </p>

                {/* Converter card */}
                <div style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 20, overflow: "hidden",
                }}>
                    {/* Tab bar */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        borderBottom: `1px solid ${C.border}`, padding: "0 8px",
                    }}>
                        {["Convert & Compress", "Batch Resize", "Analyze"].map((t, i) => (
                            <div
                                key={t}
                                className={`pf-tab${i === activeTab ? " active" : ""}`}
                                onClick={() => setActiveTab(i)}
                                style={{
                                    padding: "16px 20px", fontSize: 13, cursor: "pointer",
                                    color: i === activeTab ? C.accent : C.muted,
                                    borderBottom: i === activeTab ? `2px solid ${C.accent}` : "2px solid transparent",
                                    transition: "all .2s", letterSpacing: ".02em",
                                }}
                            >{t}</div>
                        ))}
                        <div className="pf-tab-extra" style={{ marginLeft: "auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ background: C.card2, border: `1px solid ${C.border2}`, padding: "2px 8px", borderRadius: 4, fontSize: 11, color: C.muted }}>Drop</span>
                            <span style={{ fontSize: 11, color: C.muted2 }}>to upload</span>
                        </div>
                    </div>

                    <div style={{ padding: 32 }}>
                        {/* ─── DROP ZONE ──────────────────────────────────────────────── */}
                        <div
                            className={`pf-dropzone pf-dropzone-inner ${isDragging ? "drag-over" : ""}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragging ? C.accent : C.border2}`,
                                borderRadius: 14, padding: "56px 32px", textAlign: "center",
                                cursor: "pointer", transition: "all .25s",
                                background: isDragging ? "rgba(110,231,183,.04)" : "transparent",
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <div style={{
                                width: 64, height: 64, borderRadius: 16, margin: "0 auto 24px",
                                background: "rgba(110,231,183,.1)", border: "1px solid rgba(110,231,183,.2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <FiUploadCloud size={28} color={C.accent} strokeWidth={1.5} />
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                                {isDragging ? "Release to upload" : "Drop images here"}
                            </div>
                            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>
                                or click to browse · JPG, PNG, WebP, AVIF, BMP, GIF · up to 50 files at once<br />
                                <span style={{ fontSize: 11, color: C.muted2 }}>All processing is local — nothing leaves your device</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 20 }}>
                                {["PNG", "JPEG", "WebP", "AVIF", "BMP", "GIF", "ICO", "TIFF"].map((f) => (
                                    <span key={f} style={{
                                        background: C.card2, border: `1px solid ${C.border}`,
                                        padding: "3px 10px", borderRadius: 4, fontSize: 11,
                                        letterSpacing: ".06em", color: C.muted,
                                    }}>{f}</span>
                                ))}
                            </div>
                        </div>

                        {/* ─── SETTINGS ROW ───────────────────────────────────────────── */}
                        {activeTab !== 2 && (
                            <div className="pf-settings-row" style={{
                                display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20,
                                padding: 24, background: C.card2, borderRadius: 14, border: `1px solid ${C.border}`,
                            }}>
                                {/* Format */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 160px" }}>
                                    <label style={{ fontSize: 11, letterSpacing: ".08em", color: C.muted }}>OUTPUT FORMAT</label>
                                    <select
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        style={{
                                            background: C.card, border: `1px solid ${C.border2}`, color: C.text,
                                            padding: "9px 12px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: 13, outline: "none", width: "100%",
                                        }}
                                    >
                                        {FORMATS.map((f) => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quality */}
                                {activeTab === 0 && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "2 1 200px", opacity: isLossy ? 1 : .45 }}>
                                        <label style={{ fontSize: 11, letterSpacing: ".08em", color: C.muted }}>
                                            QUALITY — <span style={{ color: C.accent }}>{quality}%</span>
                                        </label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <input
                                                type="range" min="10" max="100" step="5"
                                                value={quality}
                                                disabled={!isLossy}
                                                onChange={(e) => setQuality(Number(e.target.value))}
                                                style={{ flex: 1, height: 4 }}
                                            />
                                            <span style={{ fontSize: 13, color: C.accent, minWidth: 32, textAlign: "right" }}>{quality}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Resize Settings */}
                                {activeTab === 1 && (
                                    <>

                                        {/* Max Width */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 120px" }}>
                                            <label style={{ fontSize: 11, letterSpacing: ".08em", color: C.muted }}>MAX WIDTH (PX)</label>
                                            <input
                                                type="number"
                                                value={maxW}
                                                onChange={(e) => setMaxW(e.target.value)}
                                                placeholder="e.g. 1920"
                                                min="1"
                                                style={{
                                                    background: C.card, border: `1px solid ${C.border2}`, color: C.text,
                                                    padding: "9px 12px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                                                    fontSize: 13, outline: "none", width: "100%",
                                                }}
                                            />
                                        </div>

                                        {/* Max Height */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 120px" }}>
                                            <label style={{ fontSize: 11, letterSpacing: ".08em", color: C.muted }}>MAX HEIGHT (PX)</label>
                                            <input
                                                type="number"
                                                value={maxH}
                                                onChange={(e) => setMaxH(e.target.value)}
                                                placeholder="e.g. 1080"
                                                min="1"
                                                style={{
                                                    background: C.card, border: `1px solid ${C.border2}`, color: C.text,
                                                    padding: "9px 12px", borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
                                                    fontSize: 13, outline: "none", width: "100%",
                                                }}
                                            />
                                        </div>

                                        {/* Lock ratio */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
                                            <label style={{ fontSize: 11, letterSpacing: ".08em", color: C.muted }}>RATIO</label>
                                            <button
                                                className="pf-lock-btn"
                                                onClick={() => setLocked((v) => !v)}
                                                title={locked ? "Lock aspect ratio (on)" : "Lock aspect ratio (off)"}
                                                style={{
                                                    background: C.card, border: `1px solid ${locked ? C.accent : C.border2}`,
                                                    color: locked ? C.accent : C.muted, width: 38, height: 38, borderRadius: 8,
                                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                    transition: "all .2s",
                                                }}
                                            >
                                                {locked ? <FiLock size={15} /> : <FiUnlock size={15} />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ─── FILE QUEUE ─────────────────────────────────────────────── */}
                        {fileItems.length > 0 && (
                            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                                {fileItems.map((item) => (
                                    <FileItemRow
                                        key={item.id}
                                        item={item}
                                        format={format}
                                        onRemove={removeItem}
                                        onDownload={downloadItem}
                                        onCompare={setCompareItem}
                                        activeTab={activeTab}
                                    />
                                ))}
                            </div>
                        )}

                        {/* ─── ACTION BAR ─────────────────────────────────────────────── */}
                        {fileItems.length > 0 && (
                            <div className="pf-action-bar" style={{
                                display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                                marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.border}`,
                            }}>
                                <span style={{ fontSize: 12, color: C.muted }}>
                                    {fileItems.length} file{fileItems.length !== 1 ? "s" : ""}
                                    {hasDone && ` · ${fileItems.filter((i) => i.status === "done").length} converted`}
                                </span>

                                {/* Convert */}
                                {activeTab !== 2 && hasIdle && (
                                    <button
                                        className="pf-convert-btn"
                                        onClick={startConversion}
                                        disabled={isConverting}
                                        style={{
                                            background: C.accent, color: "#07070E", border: "none",
                                            padding: "12px 28px", borderRadius: 8,
                                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600,
                                            cursor: isConverting ? "not-allowed" : "pointer",
                                            opacity: isConverting ? .5 : 1,
                                            transition: "all .2s", display: "flex", alignItems: "center", gap: 8,
                                        }}
                                    >
                                        {isConverting && <FiRefreshCw size={16} className="pf-spin" />}
                                        {isConverting ? "Converting…" : (activeTab === 1 ? `Resize ${fileItems.filter((i) => i.status === "idle").length} File${fileItems.filter((i) => i.status === "idle").length !== 1 ? "s" : ""}` : `Convert ${fileItems.filter((i) => i.status === "idle").length} File${fileItems.filter((i) => i.status === "idle").length !== 1 ? "s" : ""}`)}
                                    </button>
                                )}

                                {/* Download all */}
                                {activeTab !== 2 && hasDone && (
                                    <button
                                        className="pf-dl-btn"
                                        onClick={downloadAll}
                                        style={{
                                            background: "transparent", color: C.success,
                                            border: `1px solid rgba(52,211,153,.3)`,
                                            padding: "12px 24px", borderRadius: 8,
                                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
                                            cursor: "pointer", transition: "all .2s",
                                            display: "flex", alignItems: "center", gap: 8,
                                        }}
                                    >
                                        <FiDownload size={15} />
                                        {fileItems.filter((i) => i.status === "done").length > 1 ? "Download ZIP" : "Download"}
                                    </button>
                                )}

                                {/* Clear */}
                                <button
                                    className="pf-clear-btn"
                                    onClick={clearAll}
                                    style={{
                                        marginLeft: "auto", background: "transparent", color: C.muted,
                                        border: `1px solid ${C.border}`, padding: "12px 20px", borderRadius: 8,
                                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
                                        cursor: "pointer", transition: "all .2s",
                                    }}
                                >Clear All</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {compareItem && (
                <CompareModal
                    item={compareItem}
                    format={format}
                    onClose={() => setCompareItem(null)}
                />
            )}
        </section>
    );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
    <footer style={{
        background: C.surface, borderTop: `1px solid ${C.border}`,
        padding: "56px 24px", textAlign: "center",
    }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.text, marginBottom: 16 }}>
            Pixel<span style={{ color: C.accent }}>Forge</span>
        </div>
        <p style={{ color: C.muted, fontSize: 13 }}>
            100% browser-based image conversion · No uploads · No accounts · No tracking
        </p>
        <p style={{ color: C.muted2, fontSize: 11, marginTop: 8 }}>
            Powered by Canvas API &amp; Web Workers · Works offline once loaded
        </p>
    </footer>
);

// ─── Compare Modal ────────────────────────────────────────────────────────────
const CompareModal = ({ item, format, onClose }) => {
    const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial measurement

        // Disable body scroll when modal is open
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("resize", handleResize);
            document.body.style.overflow = "";
        };
    }, []);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(pos);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
        }
    };

    const handleMouseMove = (e) => {
        if (e.buttons === 1) { // Left mouse button down
            handleMove(e.clientX);
        }
    };

    const handleClick = (e) => {
        handleMove(e.clientX);
    };

    const origUrl = item.originalRenderableUrl || item.thumbUrl;
    const convUrl = item.convertedUrl;

    const saving = item.newSize && item.origSize
        ? (((item.origSize - item.newSize) / item.origSize) * 100).toFixed(1)
        : null;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(7, 7, 14, 0.96)", backdropFilter: "blur(20px)",
            display: "flex", flexDirection: "column", padding: "24px",
            fontFamily: "'IBM Plex Mono', monospace", color: C.text,
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{item.file.name}</h3>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                        Original ({fmtSize(item.origSize)}) vs. {format.toUpperCase()} ({fmtSize(item.newSize)})
                        {saving > 0 && <span style={{ color: C.success }}> · {saving}% smaller</span>}
                    </div>
                </div>
                <button onClick={onClose} style={{
                    background: C.card2, border: `1px solid ${C.border}`, color: C.text,
                    width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto",
                    transition: "all .2s"
                }} className="pf-btn-ghost">
                    <FiX size={20} />
                </button>
            </div>

            {/* Slider Container */}
            <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", position: "relative", borderRadius: 12, border: `1px solid ${C.border}`,
                background: "#090912",
            }}>
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    onClick={handleClick}
                    style={{
                        position: "relative", width: "90%", height: "90%",
                        cursor: "ew-resize", userSelect: "none", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                >
                    {/* Converted Image (Right/Background) */}
                    <img
                        src={convUrl}
                        alt="Converted"
                        style={{
                            width: dimensions.width || "100%",
                            height: dimensions.height || "100%",
                            objectFit: "contain",
                            pointerEvents: "none", userSelect: "none",
                        }}
                    />

                    {/* Original Image (Left/Foreground Overlay) */}
                    <div style={{
                        position: "absolute", left: 0, top: 0, bottom: 0, overflow: "hidden",
                        width: `${sliderPos}%`,
                        borderRight: `2px solid ${C.accent}`,
                        zIndex: 2, pointerEvents: "none"
                    }}>
                        <img
                            src={origUrl}
                            alt="Original"
                            style={{
                                position: "absolute", left: 0, top: 0,
                                width: dimensions.width,
                                height: dimensions.height,
                                objectFit: "contain",
                                pointerEvents: "none", userSelect: "none",
                                maxWidth: "none", maxHeight: "none"
                            }}
                        />
                    </div>

                    {/* Draggable Divider Handle */}
                    <div style={{
                        position: "absolute", left: `${sliderPos}%`, top: 0, bottom: 0,
                        width: 2, background: C.accent, pointerEvents: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 3
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: "50%", background: C.accent,
                            border: `4px solid ${C.bg}`, display: "flex", alignItems: "center",
                            justifyContent: "center", color: C.bg, boxShadow: "0 0 16px rgba(110,231,183,0.6)",
                        }}>
                            <FiSliders size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Tip */}
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: C.muted }}>
                Drag left/right to compare details. The left side is original, the right side is compressed.
            </div>
        </div>
    );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const PixelForge = () => {
    const scrollToConverter = () => {
        document.getElementById("converter")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <GlobalStyles />
            <Navbar onConvertClick={scrollToConverter} />
            <Hero onStart={scrollToConverter} />
            <FormatStrip />
            <Features />
            <HowItWorks />
            <ConverterSection />
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                theme="dark"
                toastStyle={{ fontFamily: "'IBM Plex Mono', monospace" }}
            />
        </>
    );
};

export default PixelForge;