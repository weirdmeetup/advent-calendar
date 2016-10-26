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
    console.log("Logined")
    adventCalendar.uid = user.uid
    renderApp()
  } else {
    console.log("Guest")
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

const buildItems = (defaultItems, fetchedItems) => {
  const ensuredFetchedItems = fetchedItems || []
  const mergedItems = defaultItems
  ensuredFetchedItems.forEach(item => {
    mergedItems[item.day - 1] = item
  })
  return mergedItems
}

// Init Riot app
const adventCalendar = {
  uid: null,
  items : defaultItems()
}

window.adventCalendar = adventCalendar

const renderApp = () => {
  const uid = adventCalendar.uid
  const items = adventCalendar.items

  riot.mount("user-status", { signIn: signIn,
                              signOut: signOut,
                              uid: uid })
  riot.mount("calendar", {
    items: items,
    uid: uid,
    saveDay: saveData,
    deleteDay: deleteData,
    loadData: loadData })
}

loadData()
