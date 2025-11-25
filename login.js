import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, addDoc } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6S2lmIUwKUFptBrJKftVyP_F6j-X2XGM",
  authDomain: "sign-up-vafm.firebaseapp.com",
  projectId: "sign-up-vafm",
  storageBucket: "sign-up-vafm.firebasestorage.app",
  messagingSenderId: "561614233020",
  appId: "1:561614233020:web:4a0c3658e343cb74271fb9"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inscription
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const username = document.getElementById("register-username").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      username: username,
      createdAt: new Date()
    });

    alert("✅ Compte créé avec succès !");
  } catch (error) {
    alert("❌ Erreur : " + error.message);
  }
});

// Connexion
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Bienvenue " + userCredential.user.email);
  } catch (error) {
    alert("❌ Erreur : " + error.message);
  }
});
