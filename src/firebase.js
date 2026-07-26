// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDf8VnoOCKnObpfSvz5ecpRosLoGTGComg",
    authDomain: "image-converter-b5c32.firebaseapp.com",
    projectId: "image-converter-b5c32",
    storageBucket: "image-converter-b5c32.appspot.com",
    messagingSenderId: "319595657177",
    appId: "1:319595657177:web:5861cfa3b1d7436bf74bc8",
    measurementId: "G-KVHMWLMC6G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
