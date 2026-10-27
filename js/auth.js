// auth.js - Handles Firebase Google Authentication and Cloud Firestore Synchronization

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

export function initAuth(onStateChangedCallback) {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        const signInBtn = document.getElementById('googleSignInBtn');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (user) {
            if (signInBtn) signInBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            if (userAvatar) userAvatar.src = user.photoURL || '';
            if (userName) userName.innerText = user.displayName || 'Player';
        } else {
            if (signInBtn) signInBtn.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
        }

        if (onStateChangedCallback) {
            onStateChangedCallback(user);
        }
    });
}

export async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
}

export async function logoutGoogle() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Sign-Out Error:", error);
    }
}

export async function saveCloudGame(gameState) {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).set({
            ...gameState,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error saving to cloud:", error);
    }
}

export async function loadCloudGame() {
    if (!currentUser) return null;
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            return doc.data();
        }
    } catch (error) {
        console.error("Error loading from cloud:", error);
    }
    return null;
}

window.loginWithGoogle = loginWithGoogle;
window.logoutGoogle = logoutGoogle;
