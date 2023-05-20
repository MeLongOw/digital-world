// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCW1HFsmK2VHzuNtM2QRjXW2OaPV84KRSQ",
    authDomain: "e-commerce-45dd2.firebaseapp.com",
    projectId: "e-commerce-45dd2",
    storageBucket: "e-commerce-45dd2.appspot.com",
    messagingSenderId: "986436786092",
    appId: "1:986436786092:web:d959692dfddd9552ed4c09",
    measurementId: "G-4D8Q2T08BF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
