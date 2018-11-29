"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var refreshData = function refreshData() {
  var options = {};
  return fetch("https://www.weirdx.io/api/advent/" + adventCalendar.slug + "/devotions/", options).then(function (res) {
    return res.json();
  }).then(function (devotions) {
    var items = [];

    for (var key in devotions) {
      items.push(devotions[key]);
    }
    adventCalendar.items = buildItems(items);
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
    var paddingDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - paddingDay);
    var dayCount = paddingDay > 3 ? 35 : 28;

    var arr = [];
    for (var i = 0; i != dayCount; i++) {
      var date = new Date(startDate.getTime());
      date.setHours(0);
      arr.push({
        date: date,
        day: startDate.getDate(),
        username: "",
        subject: "",
        link: ""
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    return arr;
  };
};

var groupItemsByWeek = function groupItemsByWeek(items) {
  var weeks = [];
  while (items.length !== 0) {
    weeks.push({ days: items.splice(0, 7) });
  }
  return weeks;
};

var buildItems = function buildItems(fetchedItems) {
  var items = defaultItems();
  var ensuredFetchedItems = fetchedItems || [];
  var offset = 30 - items[0].date.getDate();

  for (var i = 0; i != ensuredFetchedItems.length; i++) {
    var item = ensuredFetchedItems[i];
    var day = Number(item.booked_at.split('-')[2]);
    var index = day + offset;
    var date = items[index].date;

    items[index] = item;
    item.date = date;
    item.day = day;
  }

  return groupItemsByWeek(items);
};
// End Utility

var renderApp = function renderApp() {
  var username = adventCalendar.username;
  var items = adventCalendar.items;

  riot.mount("header-nav", {});
  riot.mount("calendar", { items: items });
};

// Init app
var adventCalendar = _defineProperty({
  username: localStorage.getItem('username') || null,
  items: null,
  slug: null,
  currentYear: 2017
}, "slug", '2017-normal-advent');
var defaultItems = factoryDefaultItems(adventCalendar.currentYear);

// App start
adventCalendar.items = loadCache();
renderApp();
refreshData();