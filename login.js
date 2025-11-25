  // Import Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

  // Config Firebase (à récupérer dans ta console Firebase)
  const firebaseConfig = {
    apiKey: "TA_CLE_API",
    authDomain: "ton-projet.firebaseapp.com",
    projectId: "ton-projet",
    storageBucket: "ton-projet.appspot.com",
    messagingSenderId: "XXXXXXX",
    appId: "XXXXXXX"
  };

  // Initialisation
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Exemple inscription
  function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log("✅ Inscription réussie :", userCredential.user);
      })
      .catch(error => {
        console.error("❌ Erreur :", error.message);
      });
  }

  // Exemple connexion
  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log("✅ Connexion réussie :", userCredential.user);
      })
      .catch(error => {
        console.error("❌ Erreur :", error.message);
      });
  }
