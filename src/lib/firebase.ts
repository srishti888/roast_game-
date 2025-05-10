// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG0RwasQ43BMmMRPvhtw7Jq3qsZNa8POM",
  authDomain: "roastgame-399c6.firebaseapp.com",
  projectId: "roastgame-399c6",
  storageBucket: "roastgame-399c6.firebasestorage.app",
  messagingSenderId: "733590094689",
  appId: "1:733590094689:web:9eaea89b690373ef617b20",
  measurementId: "G-LDFWJ9ZDSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };