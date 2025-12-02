import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - LV Distribuidora 24h
const firebaseConfig = {
  apiKey: "AIzaSyBmRiUE5rol3W0VhdbwFs1tLKsvc0uzVn4",
  authDomain: "lv-24h-festas-bebidas.firebaseapp.com",
  projectId: "lv-24h-festas-bebidas",
  storageBucket: "lv-24h-festas-bebidas.firebasestorage.app",
  messagingSenderId: "212529351998",
  appId: "1:212529351998:web:814d4e73944d001f71b06f",
  measurementId: "G-GVZ0R3ZHKE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
