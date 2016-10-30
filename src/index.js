// Initialize code
const config = {
  apiKey: "AIzaSyAiqGYAd5Cqa9R546LZFQHGk06K5FioAPk",
  authDomain: "adventcalendar-f70f4.firebaseapp.com",
  databaseURL: "https://adventcalendar-f70f4.firebaseio.com",
  messagingSenderId: "1044702803525"
}
firebase.initializeApp(config)

// Prepare CRUD with firebase
const saveData = (day, author, title, url) => {
  firebase.database().ref(`days/${day - 1}`).set({
    day: day,
    uid: adventCalendar.uid,
    author: author,
    title: title,
    url: url
  })
}

const deleteData = day => {
  firebase.database().ref(`days/${day - 1}`).remove()
}

const loadData = () => {
  return firebase.database().ref("/days").once("value").then(snap => {
    adventCalendar.items = buildItems(defaultItems(), snap.val())
    renderApp()
  })
}

// Prepare auth
const provider = new firebase.auth.GoogleAuthProvider()

const signIn = () => {
  firebase.auth().signInWithRedirect(provider).then(result => {
    const user = result.user
    // ...
  }).catch(error => {
    const errorCode = error.code
    const errorMessage = error.message
    const email = error.email
    const credential = error.credential
  })
}
window.signIn = signIn

const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Success log out")
  }, error => {
    console.log("Fail log out")
  })
}
window.signOut = signOut

// Login check
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    adventCalendar.uid = user.uid
    renderApp()
  } else {
    adventCalendar.uid = null
    renderApp()
  }
})

const defaultItems = () => {
  const arr = []
  for(let i=1; i !=26; i++) {
    arr.push({day: i, author: "", title: "", url: ""})
  }
  return arr
}

const groupItemsByWeek = (items, year) => {
  const startWeekday = new Date(`${year}-12-1`).getDay()
  const paddingDay = 7 - startWeekday
  const arr = []
  for(let i=0; i!= paddingDay; i++) {
    arr.push({day: 31 - paddingDay + i})
  }
  const allDay = arr.concat(items)

  const weeks = []
  while(allDay.length !== 0) {
    weeks.push({days: allDay.splice(0, 7)})
  }
  return weeks
}

const buildItems = (defaultItems, fetchedItems) => {
  const ensuredFetchedItems = fetchedItems || []
  const mergedItems = defaultItems
  ensuredFetchedItems.forEach(item => {
    mergedItems[item.day - 1] = item
  })
  return groupItemsByWeek(mergedItems, adventCalendar.year)
}

// Setup Form
const openForm = (defaultData, cb) => {
  vex.dialog.open({
    showCloseButton: false,
    message: "필요한 정보를 입력해주세요.",
    input: [
      `<input name="author" type="text" placeholder="이름" value="${defaultData.author}" required />`,
      `<input name="title" type="text" placeholder="제목" value="${defaultData.title}" required />`,
      `<input name="url" type="text" placeholder="URL" value="${defaultData.url}" required />`
    ].join(""),
    buttons: [
      {text: "예약하기", type: "submit", className: "vex-dialog-button-primary", click: vex.dialog.buttons.YES.click},
      {text: "취소하기", type: "button", className: "vex-dialog-button-secondary", click: vex.dialog.buttons.NO.click}
    ],
    callback: cb
  })
}

// Init Riot app
const adventCalendar = {
  uid: null,
  year: 2016,
  items: groupItemsByWeek(defaultItems(), 2016)
}

window.adventCalendar = adventCalendar

const renderApp = () => {
  const uid = adventCalendar.uid
  const items = adventCalendar.items

  riot.mount("header-nav", { signIn: signIn,
                             signOut: signOut,
                             uid: uid })
  riot.mount("calendar", {
    items: items,
    uid: uid,
    saveDay: saveData,
    deleteDay: deleteData,
    loadData: loadData,
    openForm: openForm
  })
}

loadData()
