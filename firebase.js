
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const admin = require('firebase-admin')
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj3CGiq-Ns3XWmzQHkHcCFbXPQ5iPA5qw",
  authDomain: "cosmetic-messaging.firebaseapp.com",
  projectId: "cosmetic-messaging",
  storageBucket: "cosmetic-messaging.appspot.com",
  messagingSenderId: "430635722997",
  appId: "1:430635722997:web:d425a1d90515e5eb69fdbc"
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);
module.exports = {admin}
