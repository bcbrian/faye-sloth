import { getAuth } from "./firebase.server";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export async function emailAndPasswordSignUp({
  email,
  password,
}): Promise<User> {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  return user;
}

export async function emailAndPasswordSignIn({
  email,
  password,
}): Promise<User> {
  const auth = getAuth();

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  return user;
}

export function signOut() {
  const auth = getAuth();

  auth
    .signOut()
    .then(function () {
      // Sign-out successful.
      // console.log("signed out!");
    })
    .catch(function (error) {
      // An error happened.
    });
}

export function handleAuthStateChanged(cb) {
  const auth = getAuth();

  return onAuthStateChanged(auth, function (user) {
    cb && typeof cb === "function" && cb(user);
  });
}

export function handleIdTokenChanged(cb) {
  const auth = getAuth();

  return onIdTokenChanged(auth, function (user) {
    cb && typeof cb === "function" && cb(user);
  });
}

export function getCurrentUser(){
  const auth = getAuth();

  return auth.currentUser;
}

export async function triggerTokenRefresh(){
  const user = getCurrentUser();
  if (user) await user.getIdToken(true);
}
