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
    author: author,
    title: title,
    url: url
  })
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
    // const token = result.credential.accessToken
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
    console.log("Logined")
    adventCalendar.logined = true
    renderApp()
  } else {
    console.log("Guest")
    adventCalendar.logined = false
    renderApp()
  }
})

const defaultItems = () => {
  const arr = []
  for(let i=1; i !=32; i++) {
    arr.push({day: i, author: "", title: "", url: ""})
  }
  return arr
}

const buildItems = (defaultItems, fetchedItems) => {
  const mergedItems = defaultItems
  fetchedItems.forEach(item => {
    mergedItems[item.day - 1] = item
  })
  return mergedItems
}

// Init Riot app
const adventCalendar = {
  logined: false,
  items : defaultItems()
}

window.adventCalendar = adventCalendar

const renderApp = () => {
  const logined = adventCalendar.logined
  const items = adventCalendar.items

  riot.mount("user-status", { signIn: signIn,
                              signOut: signOut,
                              logined: logined })
  riot.mount("calendar", {
    items: items,
    logined: logined,
    saveDay: saveData,
    loadData: loadData })
}

loadData()
