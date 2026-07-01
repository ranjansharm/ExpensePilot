/*
  firebase.js — Phase 3 placeholder.

  Firebase is NOT connected yet (as requested). Right now, the app
  runs entirely on localStorage via transactions.js (see DB.* below,
  which transactions.js and settings.js already call).

  When you're ready to move to Firebase, you will:
  1. Add the Firebase SDK <script> tags in index.html
  2. Paste your Firebase config into firebaseConfig below
  3. Replace the localStorage calls inside DB.* with Firestore calls
     (getDocs/addDoc/updateDoc/deleteDoc) — the rest of the app
     (dashboard.js, calendar.js, reports.js) will keep working
     unchanged because they only ever talk to DB.*, never to
     localStorage or Firestore directly.
*/

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

const FIREBASE_ENABLED = false; // flip to true once you wire up the SDK above

// ---------------------------------------------------------------
// DB abstraction layer — this is what the rest of the app calls.
// Phase 1/2: backed by localStorage. Phase 3: swap internals only.
// ---------------------------------------------------------------
const DB = {
  KEYS: {
    transactions: 'ep_transactions',
    settings: 'ep_settings'
  },

  getTransactions(){
    try{
      return JSON.parse(localStorage.getItem(this.KEYS.transactions) || '[]');
    }catch(e){
      return [];
    }
  },

  saveTransactions(list){
    localStorage.setItem(this.KEYS.transactions, JSON.stringify(list));
  },

  addTransaction(tx){
    const list = this.getTransactions();
    list.push(tx);
    this.saveTransactions(list);
    return tx;
  },

  deleteTransaction(id){
    const list = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(list);
  },

  getSettings(){
    try{
      return JSON.parse(localStorage.getItem(this.KEYS.settings) || '{}');
    }catch(e){
      return {};
    }
  },

  saveSettings(settings){
    localStorage.setItem(this.KEYS.settings, JSON.stringify(settings));
  }
};
