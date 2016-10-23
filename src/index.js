// Initialize code
const config = {
  apiKey: "AIzaSyAiqGYAd5Cqa9R546LZFQHGk06K5FioAPk",
  authDomain: "adventcalendar-f70f4.firebaseapp.com",
  databaseURL: "https://adventcalendar-f70f4.firebaseio.com",
  messagingSenderId: "1044702803525"
}
firebase.initializeApp(config)

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
  } else {
    console.log("Guest")
  }
})
