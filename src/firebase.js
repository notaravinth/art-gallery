// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCMeoka7MAZP1WgCwdKoQrLKUPmIK3jW3Y",
    authDomain: "art-gallery-d7803.firebaseapp.com",
    projectId: "art-gallery-d7803",
    storageBucket: "art-gallery-d7803.firebasestorage.app",
    messagingSenderId: "627541895272",
    appId: "1:627541895272:web:7514547a11a1de5d3d33dd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
