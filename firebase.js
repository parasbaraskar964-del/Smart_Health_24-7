/* ===================================================================
   firebase.js  -  Firebase setup + login/database helper functions
   Must be loaded BEFORE script.js in index.html.
   Best way to run: VS Code "Live Server" or `python -m http.server 8000`.
   =================================================================== */

// ---------------- Firebase setup (loaded on demand) ----------------
const firebaseConfig = {
    apiKey: "AIzaSyDf2IcRfSejBrrav1orNgCgSCX7rAwBct8",
    authDomain: "smarthealth-18302.firebaseapp.com",
    databaseURL: "https://smarthealth-18302-default-rtdb.firebaseio.com",
    projectId: "smarthealth-18302",
    storageBucket: "smarthealth-18302.firebasestorage.app",
    messagingSenderId: "638383163074",
    appId: "1:638383163074:web:e4a182e7eb614f8e829d5b",
    measurementId: "G-V6KNVD01S4"
};

let FB = null; // holds the Firebase functions once loaded

const firebaseLoading = (async () => {
    const base = "https://www.gstatic.com/firebasejs/12.1.0/";
    const [appM, authM, dbM] = await Promise.all([
        import(base + "firebase-app.js"),
        import(base + "firebase-auth.js"),
        import(base + "firebase-database.js")
    ]);
    const app = appM.initializeApp(firebaseConfig);
    FB = { authM, dbM, auth: authM.getAuth(app), db: dbM.getDatabase(app) };
    // Analytics is optional - never block the app on it
    import(base + "firebase-analytics.js")
        .then(m => { try { m.getAnalytics(app); } catch (e) {} })
        .catch(() => {});
})();

async function fbReady() {
    try {
        await firebaseLoading;
    } catch (e) {
        console.error('Firebase failed to load:', e);
        const err = new Error('Could not load Firebase. Check your internet connection and open the site with Live Server (http://localhost), not by double-clicking the file.');
        err.code = 'app/firebase-load-failed';
        throw err;
    }
}

window.firebaseCurrentUser = null;
window.firebaseCreateAccount = async (email, password) => { await fbReady(); return FB.authM.createUserWithEmailAndPassword(FB.auth, email, password); };
window.firebaseLogin = async (email, password) => { await fbReady(); return FB.authM.signInWithEmailAndPassword(FB.auth, email, password); };
window.firebaseLogout = async () => { await fbReady(); return FB.authM.signOut(FB.auth); };
window.firebaseSaveProfile = async (uid, data) => { await fbReady(); return FB.dbM.set(FB.dbM.ref(FB.db, `users/${uid}/profile`), data); };
window.firebaseAddHistory = async (uid, entry) => { await fbReady(); return FB.dbM.push(FB.dbM.ref(FB.db, `users/${uid}/history`), entry); };
window.firebaseGetHistory = async (uid) => {
    await fbReady();
    const snapshot = await FB.dbM.get(FB.dbM.ref(FB.db, `users/${uid}/history`));
    return snapshot.exists() ? snapshot.val() : {};
};
window.firebaseWaitForUser = async () => {
    await fbReady();
    return new Promise((resolve) => {
        const unsub = FB.authM.onAuthStateChanged(FB.auth, (user) => {
            window.firebaseCurrentUser = user || null;
            unsub();
            resolve(user || null);
        });
    });
};
