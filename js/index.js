"use strict";

// Initialize firebase
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

var refresh = function refresh() {
  return firebase.database().ref("/days").once("value").then(function (snap) {
    adventCalendar.items = buildItems(snap.val());
    renderApp();
  });
};

// Prepare auth
var provider = new firebase.auth.GoogleAuthProvider();

var signIn = function signIn() {
  firebase.auth().signInWithRedirect(provider).then(function (result) {
    adventCalendar.uid = result.user.uid;
  }).catch(function (error) {
    // const errorCode = error.code
    // const errorMessage = error.message
    // const email = error.email
    // const credential = error.credential
  });
};

var signOut = function signOut() {
  firebase.auth().signOut().then(function () {
    console.log("Success log out");
  }, function (error) {
    console.log("Fail log out");
  });
};

var factoryDefaultItems = function factoryDefaultItems(givenYear) {
  var year = givenYear;

  return function () {
    var startDate = new Date(year + "-12-01");
    var paddingDay = 8 - startDate.getDay();
    startDate.setDate(startDate.getDate() - paddingDay);
    var dayCount = paddingDay > 3 ? 35 : 28;

    var arr = [];
    for (var i = 0; i != dayCount; i++) {
      arr.push({
        date: new Date(startDate.getTime()),
        day: startDate.getDate(),
        author: "", title: "", url: ""
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    return arr;
  };
};

var groupItemsByWeek = function groupItemsByWeek(items) {
  var allDay = items;

  var weeks = [];
  while (allDay.length !== 0) {
    weeks.push({ days: allDay.splice(0, 7) });
  }
  return weeks;
};

var buildItems = function buildItems(fetchedItems) {
  var items = defaultItems();
  var ensuredFetchedItems = fetchedItems || [];
  var offset = 30 - items[0].date.getDate();

  ensuredFetchedItems.forEach(function (item) {
    var index = item.day * 1 + offset;
    var date = items[index].date;

    items[index] = item;
    item.date = date;
  });
  return groupItemsByWeek(items);
};

// Setup Form
var openForm = function openForm(defaultData, cb) {
  vex.dialog.open({
    showCloseButton: false,
    message: "필요한 정보를 입력해주세요.",
    input: ["<input name=\"author\" type=\"text\" placeholder=\"\uC774\uB984\" value=\"" + defaultData.author + "\" required />", "<input name=\"title\" type=\"text\" placeholder=\"\uC81C\uBAA9\" value=\"" + defaultData.title + "\" required />", "<input name=\"url\" type=\"text\" placeholder=\"URL\" value=\"" + defaultData.url + "\"/>"].join(""),
    buttons: [{ text: "예약하기", type: "submit", className: "vex-dialog-button-primary", click: vex.dialog.buttons.YES.click }, { text: "취소하기", type: "button", className: "vex-dialog-button-secondary", click: vex.dialog.buttons.NO.click }],
    callback: cb
  });
};

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
    refresh: refresh,
    openForm: openForm
  });
};

// Init Riot app
var adventCalendar = {
  uid: null,
  items: null
};
var defaultItems = factoryDefaultItems(2016);

// Login check
// & Trigger app start
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    adventCalendar.uid = user.uid;
  } else {
    adventCalendar.uid = null;
  }
  refresh();
});