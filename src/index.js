// CRUD functions with firebase
const refresh = () => {
  return $.getJSON("/data.json").then(items => {
    items.forEach(week => {
      week.days.forEach(day => day.date = new Date(day.date))
    })
    adventCalendar.items = items
    saveCache(adventCalendar.items)
    renderApp()
  })
}
// END CRUD functions with firebase

// Setup cache to localStorage for progressive start
const saveCache = items => {
  if (localStorage) {
    localStorage.setItem("days", JSON.stringify(items))
  }
}

const loadCache = () => {
  if (localStorage && localStorage.getItem("days")) {
    const days = JSON.parse(localStorage.getItem("days"))

    days.forEach(week => {
      week.days.forEach(day => day.date = new Date(day.date))
    })
    return days
  }
  return null
}

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

const renderApp = () => {
  const uid = adventCalendar.uid
  const items = adventCalendar.items

  riot.mount("header-nav")
  riot.mount("calendar", {
    items: items,
    uid: uid,
    refresh: refresh
  })
}

// Init app
const adventCalendar = {
  uid: null,
  items: null,
  currentYear: 2016
}
const defaultItems = factoryDefaultItems(adventCalendar.currentYear)

// Trigger app start
adventCalendar.items = loadCache()
renderApp()
refresh()
