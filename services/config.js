import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import { initialWindowMetrics } from "react-native-safe-area-context";
// Manually extract Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDx3Y_YxtRCFIhy6V81ppH92GzGOr1mp7o",
  authDomain: "viralizer-fd96a.firebaseapp.com",
  projectId: "viralizer-fd96a",
  storageBucket: "viralizer-fd96a.firebasestorage.app",
  messagingSenderId: "466731416111",
  appId: "1:466731416111:android:f307decd0a05ddfa3624da",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { db, app , auth, storage };

