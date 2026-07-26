// import { useState, useEffect } from "react";
// import imageCompression from "browser-image-compression";
// import { FiImage, FiDownload, FiRefreshCw, FiX, FiShield, FiZap, FiCheckCircle } from "react-icons/fi";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ImageConverter = () => {
//   // ... [Keep all your existing state and logic here] ...
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [convertedFile, setConvertedFile] = useState(null);
//   const [convertedFileSize, setConvertedFileSize] = useState(null);
//   const [format, setFormat] = useState("png");
//   const [loading, setLoading] = useState(false);
//   const [conversionTime, setConversionTime] = useState(null);
//   const [isConverting, setIsConverting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [progressPercentage, setProgressPercentage] = useState(0);

//   const notifyUpload = () => toast.success("File uploaded successfully!");
//   const notifyConversion = () => toast.success("Image converted successfully!");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Please upload a valid image file.");
//       return;
//     }
//     setSelectedFile(file);
//     setConvertedFile(null);
//     notifyUpload();
//   };

//   const handleFormatChange = (e) => setFormat(e.target.value);

//   const removeSelectedFile = () => {
//     setSelectedFile(null);
//     setConvertedFile(null);
//   };

//   const convertImage = async () => {
//     if (!selectedFile) return;
//     try {
//       setLoading(true);
//       setIsConverting(true);
//       const startTime = new Date();

//       const options = {
//         maxSizeMB: 2,
//         maxWidthOrHeight: 1920,
//         useWebWorker: true,
//         fileType: `image/${format}`,
//         onProgress: (p) => {
//           setProgress(p);
//           setProgressPercentage(Math.round(p));
//         },
//       };

//       const compressedFile = await imageCompression(selectedFile, options);
//       const endTime = new Date();

//       setConvertedFile({
//         fileURL: URL.createObjectURL(compressedFile),
//         fileName: `${selectedFile.name.split('.')[0]}.${format}`,
//       });
//       setConvertedFileSize((compressedFile.size / 1024).toFixed(2));
//       setConversionTime(((endTime - startTime) / 1000).toFixed(2));
//       setSelectedFile(null);
//       notifyConversion();
//     } catch (error) {
//       toast.error("Conversion failed.");
//     } finally {
//       setLoading(false);
//       setIsConverting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
//       {/* --- NAVBAR --- */}
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center gap-2">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <FiRefreshCw className="text-white text-xl" />
//               </div>
//               <span className="text-xl font-bold tracking-tight text-blue-600">Cloud2Convert</span>
//             </div>
//             <div className="hidden md:flex space-x-8 font-medium">
//               <a href="#" className="hover:text-blue-600 transition">Tools</a>
//               <a href="#" className="hover:text-blue-600 transition">Pricing</a>
//               <a href="#" className="hover:text-blue-600 transition">API</a>
//             </div>
//             <button className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition">
//               Get Started
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <header className="pt-16 pb-8 px-4 text-center">
//         <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
//           Convert Images in Seconds
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           The fastest way to convert, compress, and optimize your images.
//           No registration required. 100% Secure & Private.
//         </p>
//       </header>

//       {/* --- TOOL CONTAINER --- */}
//       <main className="max-w-4xl mx-auto px-4 pb-20">
//         <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
//           {/* [Your Existing Tool UI Logic Start] */}
//           {!convertedFile && !selectedFile && (
//             <div className="mb-6">
//               <label htmlFor="file-upload" className="w-full h-64 border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl flex items-center justify-center text-gray-600 font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
//                 <div className="flex flex-col items-center">
//                   <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
//                     <FiImage size={40} className="text-blue-600" />
//                   </div>
//                   <span className="text-lg">Drop your image here or <span className="text-blue-600">browse</span></span>
//                   <p className="text-sm text-gray-400 mt-2 font-normal">Supports PNG, JPG, WebP, AVIF</p>
//                 </div>
//                 <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//               </label>
//             </div>
//           )}

//           {/* Selected File UI */}
//           {selectedFile && (
//             <div className="animate-in fade-in zoom-in duration-300">
//               <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
//                 <div className="relative">
//                   <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-lg" />
//                   <button onClick={removeSelectedFile} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:rotate-90 transition-transform">
//                     <FiX size={16} />
//                   </button>
//                 </div>
//                 <div className="flex-1 text-center md:text-left">
//                   <h3 className="font-bold text-lg truncate max-w-xs">{selectedFile.name}</h3>
//                   <p className="text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
//                 </div>
//                 <div className="flex flex-col gap-3 w-full md:w-auto">
//                   <select value={format} onChange={handleFormatChange} className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-bold">
//                     <option value="png">To PNG</option>
//                     <option value="webp">To WebP</option>
//                     <option value="jpeg">To JPEG</option>
//                     <option value="avif">To AVIF</option>
//                   </select>
//                   <button onClick={convertImage} disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
//                     {loading ? "Processing..." : <><FiRefreshCw /> Convert Now</>}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Progress Bar */}
//           {isConverting && (
//             <div className="mt-6">
//               <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
//                 <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
//               </div>
//               <p className="text-center text-sm font-bold mt-2 text-blue-600">{progressPercentage}%</p>
//             </div>
//           )}

//           {/* Converted Result */}
//           {convertedFile && (
//             <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center animate-in slide-in-from-bottom-4 duration-500">
//               <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready for Download!</h2>
//               <p className="text-gray-600 mb-6">Saved {((1 - (convertedFileSize / (selectedFile?.size / 1024 || 1))) * 100).toFixed(0)}% in size ({convertedFileSize} KB)</p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <a href={convertedFile.fileURL} download={convertedFile.fileName} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2">
//                   <FiDownload /> Download
//                 </a>
//                 <button onClick={() => setConvertedFile(null)} className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
//                   <FiRefreshCw /> Convert Another
//                 </button>
//               </div>
//             </div>
//           )}
//           {/* [Your Existing Tool UI Logic End] */}
//         </div>

//         {/* --- FEATURES GRID --- */}
//         <section className="mt-24 grid md:grid-cols-3 gap-8 text-center">
//           <div className="p-6">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <FiZap className="text-blue-600 text-2xl" />
//             </div>
//             <h3 className="font-bold text-xl mb-2">Lightning Fast</h3>
//             <p className="text-gray-500 text-sm">Our cloud infrastructure processes images in milliseconds using advanced compression algorithms.</p>
//           </div>
//           <div className="p-6">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <FiShield className="text-green-600 text-2xl" />
//             </div>
//             <h3 className="font-bold text-xl mb-2">Privacy First</h3>
//             <p className="text-gray-500 text-sm">Files are processed in-browser. We never store or see your images. Your data stays yours.</p>
//           </div>
//           <div className="p-6">
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <FiCheckCircle className="text-purple-600 text-2xl" />
//             </div>
//             <h3 className="font-bold text-xl mb-2">All Formats</h3>
//             <p className="text-gray-500 text-sm">Convert between JPG, PNG, WebP, AVIF, and more with zero quality loss options.</p>
//           </div>
//         </section>
//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="border-t border-gray-200 py-10 bg-white">
//         <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
//           <p>© 2026 Cloud2Convert. All rights reserved.</p>
//         </div>
//       </footer>

//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default ImageConverter;

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}