import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGM482aqBPOMwfCEf3xeOXMVO1j4IR_R0",
  authDomain: "siloguard-74db9.firebaseapp.com",
  projectId: "siloguard-74db9",
  storageBucket: "siloguard-74db9.firebasestorage.app",
  messagingSenderId: "956874085724",
  appId: "1:956874085724:web:e867cc8af3975897a9dd99",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
