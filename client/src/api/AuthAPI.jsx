import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";



export const LoginAPI = (email, password) => {
  try {
    let res = signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (err) {
    return err;
  }
};

export const RegisterAPI = (email, password) => {
  try {
    let res = createUserWithEmailAndPassword(auth, email, password);
    console.log(res);
    return res;
  } catch (err) {
    return err;
  }
};

export const GoogleSignInAPI = () => {
  try {
    let googleProvider = new GoogleAuthProvider();
    let res = signInWithPopup(auth, googleProvider);
    return res;
  } catch (err) {
    return err;
  }
};

export const onLogout = () => {
  try {
    signOut(auth);
    console.log("logged out");
  } catch (err) {
    return err;
  }
};
