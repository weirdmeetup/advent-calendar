"use strict";

// Initialize code
var config = {
  apiKey: "AIzaSyAiqGYAd5Cqa9R546LZFQHGk06K5FioAPk",
  authDomain: "adventcalendar-f70f4.firebaseapp.com",
  databaseURL: "https://adventcalendar-f70f4.firebaseio.com",
  messagingSenderId: "1044702803525"
};
firebase.initializeApp(config);

// Prepare CRUD with firebase
var saveData = function saveData(day, author, title, url) {
  firebase.database().ref("days/" + (day - 1)).set({
    day: day,
    author: author,
    title: title,
    url: url
  });
};

var loadData = function loadData() {
  return firebase.database().ref("/days").once("value").then(function (snap) {
    adventCalendar.items = buildItems(defaultItems(), snap.val());
    renderApp();
  });
};

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
    adventCalendar.logined = true;
    renderApp();
  } else {
    console.log("Guest");
    adventCalendar.logined = false;
    renderApp();
  }
});

var defaultItems = function defaultItems() {
  var arr = [];
  for (var i = 1; i != 32; i++) {
    arr.push({ day: i, author: "", title: "", url: "" });
  }
  return arr;
};

var buildItems = function buildItems(defaultItems, fetchedItems) {
  var mergedItems = defaultItems;
  fetchedItems.forEach(function (item) {
    mergedItems[item.day - 1] = item;
  });
  return mergedItems;
};

// Init Riot app
var adventCalendar = {
  logined: false,
  items: defaultItems()
};

window.adventCalendar = adventCalendar;

var renderApp = function renderApp() {
  var logined = adventCalendar.logined;
  var items = adventCalendar.items;

  riot.mount("user-status", { signIn: signIn,
    signOut: signOut,
    logined: logined });
  riot.mount("calendar", {
    items: items,
    logined: logined,
    saveDay: saveData,
    loadData: loadData });
};

loadData();