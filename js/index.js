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
    uid: adventCalendar.uid,
    author: author,
    title: title,
    url: url
  });
};

var deleteData = function deleteData(day) {
  firebase.database().ref("days/" + (day - 1)).remove();
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
    adventCalendar.uid = user.uid;
    renderApp();
  } else {
    adventCalendar.uid = null;
    renderApp();
  }
});

var defaultItems = function defaultItems() {
  var arr = [];
  for (var i = 1; i != 26; i++) {
    arr.push({ day: i, author: "", title: "", url: "" });
  }
  return arr;
};

var groupItemsByWeek = function groupItemsByWeek(items, year) {
  var startWeekday = new Date(year + "-12-1").getDay();
  var paddingDay = 7 - startWeekday;
  var arr = [];
  for (var i = 0; i != paddingDay; i++) {
    arr.push({ day: 31 - paddingDay + i });
  }
  var allDay = arr.concat(items);

  var weeks = [];
  while (allDay.length !== 0) {
    weeks.push({ days: allDay.splice(0, 7) });
  }
  return weeks;
};

var buildItems = function buildItems(defaultItems, fetchedItems) {
  var ensuredFetchedItems = fetchedItems || [];
  var mergedItems = defaultItems;
  ensuredFetchedItems.forEach(function (item) {
    mergedItems[item.day - 1] = item;
  });
  return groupItemsByWeek(mergedItems, adventCalendar.year);
};

// Setup Form
var openForm = function openForm(defaultData, cb) {
  vex.dialog.open({
    showCloseButton: false,
    message: "필요한 정보를 입력해주세요.",
    input: ["<input name=\"author\" type=\"text\" placeholder=\"\uC774\uB984\" value=\"" + defaultData.author + "\" required />", "<input name=\"title\" type=\"text\" placeholder=\"\uC81C\uBAA9\" value=\"" + defaultData.title + "\" required />", "<input name=\"url\" type=\"text\" placeholder=\"URL\" value=\"" + defaultData.url + "\" required />"].join(""),
    buttons: [{ text: "예약하기", type: "submit", className: "vex-dialog-button-primary", click: vex.dialog.buttons.YES.click }, { text: "취소하기", type: "button", className: "vex-dialog-button-secondary", click: vex.dialog.buttons.NO.click }],
    callback: cb
  });
};

// Init Riot app
var adventCalendar = {
  uid: null,
  year: 2016,
  items: groupItemsByWeek(defaultItems(), 2016)
};

window.adventCalendar = adventCalendar;

var renderApp = function renderApp() {
  var uid = adventCalendar.uid;
  var items = adventCalendar.items;

  riot.mount("header-nav", { signIn: signIn,
    signOut: signOut,
    uid: uid });
  riot.mount("calendar", {
    items: items,
    uid: uid,
    saveDay: saveData,
    deleteDay: deleteData,
    loadData: loadData,
    openForm: openForm
  });
};

loadData();