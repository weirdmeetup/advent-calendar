"use strict";

// CRUD functions with firebase
var refresh = function refresh() {
  return $.getJSON("data.json").then(function (items) {
    items.forEach(function (week) {
      week.days.forEach(function (day) {
        return day.date = new Date(day.date);
      });
    });
    adventCalendar.items = items;
    saveCache(adventCalendar.items);
    renderApp();
  });
};
// END CRUD functions with firebase

// Setup cache to localStorage for progressive start
var saveCache = function saveCache(items) {
  if (localStorage) {
    localStorage.setItem("days", JSON.stringify(items));
  }
};

var loadCache = function loadCache() {
  if (localStorage && localStorage.getItem("days")) {
    var days = JSON.parse(localStorage.getItem("days"));

    days.forEach(function (week) {
      week.days.forEach(function (day) {
        return day.date = new Date(day.date);
      });
    });
    return days;
  }
  return null;
};

// Utility
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

var renderApp = function renderApp() {
  var uid = adventCalendar.uid;
  var items = adventCalendar.items;

  riot.mount("header-nav");
  riot.mount("calendar", {
    items: items,
    uid: uid,
    refresh: refresh
  });
};

// Init app
var adventCalendar = {
  uid: null,
  items: null,
  currentYear: 2016
};
var defaultItems = factoryDefaultItems(adventCalendar.currentYear);

// Trigger app start
adventCalendar.items = loadCache();
renderApp();
refresh();
