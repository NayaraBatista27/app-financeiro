
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTR50wxVhNcj8RYnluE0t8lvsfoeRFEcM",
  authDomain: "meuappfinancas-dfdfb.firebaseapp.com",
  projectId: "meuappfinancas-dfdfb",
  storageBucket: "meuappfinancas-dfdfb.firebasestorage.app",
  messagingSenderId: "254021895708",
  appId: "1:254021895708:web:05c93514c9f1fccd93c1d9"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (erro) {
  auth = getAuth(app);
}

const db = getFirestore(app);
export { app, db, auth };
