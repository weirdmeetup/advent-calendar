// Initialize firebase
const config = {
  apiKey: "AIzaSyAiqGYAd5Cqa9R546LZFQHGk06K5FioAPk",
  authDomain: "adventcalendar-f70f4.firebaseapp.com",
  databaseURL: "https://adventcalendar-f70f4.firebaseio.com",
  messagingSenderId: "1044702803525"
}
firebase.initializeApp(config)
// Initialize Done firebase

// CRUD functions with firebase
const saveData = (day, author, title, url) => {
  firebase.database().ref(`days/${day - 1}`).set({
    day: day,
    uid: adventCalendar.uid,
    author: author,
    title: title,
    url: url || ""
  })
}

const deleteData = day => {
  firebase.database().ref(`days/${day - 1}`).remove()
}

const refresh = () => {
  return firebase.database().ref("/days").once("value").then(snap => {
    const items = []
    const obj = snap.val()
    for (let key in obj) {
      items.push(obj[key])
    }
    adventCalendar.items = buildItems(items)
    renderApp()
  })
}
// END CRUD functions with firebase

// Auth
const provider = new firebase.auth.GoogleAuthProvider()

const signIn = () => {
  firebase.auth().signInWithRedirect(provider).then(result => {
    adventCalendar.uid = result.user.uid
  }).catch(console.log)
}

const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Success log out")
  }, console.log)
}
// End Auth

// Utility
const factoryDefaultItems = givenYear => {
  const year = givenYear

  return () => {
    const startDate = new Date(`${year}-12-01`)
    const paddingDay = 8 - startDate.getDay()
    startDate.setDate(startDate.getDate() - paddingDay)
    const dayCount = paddingDay > 3 ? 35 : 28

    const arr = []
    for(let i=0; i != dayCount; i++) {
      arr.push({
        date: new Date(startDate.getTime()),
        day: startDate.getDate(),
        author: "", title: "", url: ""
      })
      startDate.setDate(startDate.getDate() + 1)
    }
    return arr
  }
}

const groupItemsByWeek = items => {
  const weeks = []
  while(items.length !== 0) {
    weeks.push({days: items.splice(0, 7)})
  }
  return weeks
}

const buildItems = fetchedItems => {
  const items = defaultItems()
  const ensuredFetchedItems = fetchedItems || []
  const offset = 30 - items[0].date.getDate()

  for(let i=0; i!= ensuredFetchedItems.length; i++) {
    const item = ensuredFetchedItems[i] 
    const index = item.day * 1 + offset
    const { date } = items[index]
    items[index] = item
    item.date = date
  }

  return groupItemsByWeek(items)
}
// End Utility

// Setup Form
const openForm = (defaultData, cb) => {
  vex.dialog.open({
    showCloseButton: false,
    message: "필요한 정보를 입력해주세요.",
    input: [
      `<input name="author" type="text" placeholder="이름" value="${defaultData.author}" required />`,
      `<input name="title" type="text" placeholder="제목" value="${defaultData.title}" required />`,
      `<input name="url" type="text" placeholder="URL" value="${defaultData.url}"/>`
    ].join(""),
    buttons: [
      {text: "예약하기", type: "submit", className: "vex-dialog-button-primary", click: vex.dialog.buttons.YES.click},
      {text: "취소하기", type: "button", className: "vex-dialog-button-secondary", click: vex.dialog.buttons.NO.click}
    ],
    callback: cb
  })
}

const renderApp = () => {
  const uid = adventCalendar.uid
  const items = adventCalendar.items

  riot.mount("header-nav", { signIn: signIn, signOut: signOut, uid: uid })
  riot.mount("calendar", {
    items: items,
    uid: uid,
    saveDay: saveData,
    deleteDay: deleteData,
    refresh: refresh,
    openForm: openForm
  })
}

// Init app
const adventCalendar = {
  uid: null,
  items: null,
  currentYear: 2016
}
const defaultItems = factoryDefaultItems(adventCalendar.currentYear)

// Login check & Trigger app start
renderApp()
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    adventCalendar.uid = user.uid
  } else {
    adventCalendar.uid = null
  }
  refresh()
})
