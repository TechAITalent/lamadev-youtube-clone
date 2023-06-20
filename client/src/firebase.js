import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjbWELwlv5Z6dMC0VYS2uLgq85ajJsAPE",
  authDomain: "ai-talent-video.firebaseapp.com",
  projectId: "ai-talent-video",
  storageBucket: "ai-talent-video.appspot.com",
  messagingSenderId: "238863537536",
  appId: "1:238863537536:web:dbfaf73190ec9f7d92dd65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;