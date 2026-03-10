import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDPE_Uaq03gI7zXqBm8nqMCAXIlEo_apZQ",
    authDomain: "gharpayycrm.firebaseapp.com",
    projectId: "gharpayycrm",
    storageBucket: "gharpayycrm.firebasestorage.app",
    messagingSenderId: "1000352273431",
    appId: "1:1000352273431:web:face5a7ac08a2eb9973852",
    measurementId: "G-VFZ8H082QY"
};

const app = initializeApp(firebaseConfig);

// Analytics only in browser environments
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, analytics };
export default app;
