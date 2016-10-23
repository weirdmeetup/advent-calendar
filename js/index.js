"use strict";

// Initialize code
var config = {
  apiKey: "AIzaSyAiqGYAd5Cqa9R546LZFQHGk06K5FioAPk",
  authDomain: "adventcalendar-f70f4.firebaseapp.com",
  databaseURL: "https://adventcalendar-f70f4.firebaseio.com",
  messagingSenderId: "1044702803525"
};
firebase.initializeApp(config);

// Prepare auth
var provider = new firebase.auth.GoogleAuthProvider();

var signIn = function signIn() {
  firebase.auth().signInWithRedirect(provider).then(function (result) {
    // const token = result.credential.accessToken
    var user = result.user;
    // ...
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
};
window.signIn = signIn;

var signOut = function signOut() {
  firebase.auth().signOut().then(function () {
    console.log("Success log out");
  }, function (error) {
    console.log("Fail log out");
  });
};
window.signOut = signOut;

// Login check
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("Logined");
  } else {
    console.log("Guest");
  }
});