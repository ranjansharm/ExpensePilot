/*
  auth.js — Phase 3 placeholder.

  No login/auth is active in Phase 1 & 2 — the app works fully
  offline for a single local user. This file is stubbed out so
  app.js can safely call Auth.isLoggedIn() without breaking,
  and so you have a clear place to add real auth later
  (Firebase Email/Google/OTP) without touching other files.
*/

const Auth = {
  isLoggedIn(){
    return true; // Phase 1/2: always "logged in" locally
  },

  getCurrentUser(){
    return { name: 'You', email: null, provider: 'local' };
  },

  // Placeholders for Phase 3
  async loginWithEmail(email, password){
    console.warn('Auth.loginWithEmail: not implemented until Firebase is connected.');
  },

  async loginWithGoogle(){
    console.warn('Auth.loginWithGoogle: not implemented until Firebase is connected.');
  },

  async sendOtp(phone){
    console.warn('Auth.sendOtp: not implemented until Firebase is connected.');
  },

  async logout(){
    console.warn('Auth.logout: not implemented — nothing to log out of yet.');
  }
};
