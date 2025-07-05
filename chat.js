import { auth, database, signInWithPopup, GoogleAuthProvider } from './firebase-init.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const provider = new GoogleAuthProvider();
let currentUser = null;

// Sign in with Google
export function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;
      document.getElementById('user-info').textContent = `Signed in as: ${currentUser.displayName}`;
      document.getElementById('chat-controls').style.display = 'block';
    })
    .catch((error) => {
      alert('Sign in failed: ' + error.message);
    });
}

// Send a message
export function sendMessage(text) {
  if (!currentUser) return;
  const messagesRef = ref(database, 'messages');
  push(messagesRef, {
    uid: currentUser.uid,
    name: currentUser.displayName,
    text: text,
    timestamp: Date.now()
  });
}

// Listen for new messages
export function listenForMessages(callback) {
  const messagesRef = ref(database, 'messages');
  onChildAdded(messagesRef, (snapshot) => {
    callback(snapshot.val());
  });
}

// Expose currentUser for UI
export function getCurrentUser() {
  return currentUser;
}
