// Auth function
const authUser = () => {
  const data = new FormData();
  data.append('client_id', '6BiCpLw9xpCxdjleWXSB1jsapi3vndsMIbmMmRJS')
  data.append('client_secret', 'VSP60KtPaBLAuY7pQ2FUH9j0r12CvDfbfOzeBJejoK5bdlpmUbc44tWrkIwIb0gs9yo1vBthNxC0srdEix4QCqF6DiPQH3jshk3JXwssA5Cz6TR40fuI4I5xpjcK5F63')
  data.append('grant_type', 'authorization_code')
  data.append('redirect_uri', 'http://localhost:8000/callback.html')
  data.append('code', window.localStorage.getItem('code'))
  data.append('state', window.localStorage.getItem('state'))

  return fetch(
    'https://www.weirdx.io/api/o/token/',
    {
      method: 'POST',
      mode: 'cors',
      body: data
    }
  ).then(res => {
    return res.json()
  }).then(json => {
    if (json.access_token) {
      window.localStorage.setItem('token', json.access_token)
      window.localStorage.setItem('expired_at', Number(new Date()) + json.expired_in * 1000)
      window.localStorage.setItem('code', null)
      window.localStorage.setItem('state', null)
    }
  })
}

// CRUD functions
const saveData = (day, author, title, url) => {
  return fetch(
    `https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions`,
    {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        Authorization: `Bearer ${adventCalendar.token}`
      }),
      body: {
        booked_at: day,
        subject: title,
        link: url || ""
      }
    }
  )
}

const deleteData = day => {
  return fetch(
    `https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions/${day}`,
    {
      method: 'DELETE',
      mode: 'cors',
      headers: new Headers({
        Authorization: `Bearer ${adventCalendar.token}`
      })
    }
  )
}

const refreshData = () => {
  return fetch('https://www.weirdx.io/api/advent/').then(res => {
    return res.json()
  }).then(obj => {
    const currentCalendar = obj[0]
    const items = []

    for (let key in currentCalendar.devotions) {
      items.push(obj[key])
    }
    adventCalendar.slug = currentCalendar.slug
    adventCalendar.items = buildItems(items)
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

// Auth
const signOut = () => {
  localStorage.setItem('token', null)
  adventCalendar.uid = null
  refreshData()
}
// End Auth

// Utility
const factoryDefaultItems = givenYear => {
  const year = givenYear

  return () => {
    const startDate = new Date(`${year}-12-01`)
    const paddingDay = startDate.getDay()
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

  riot.mount("header-nav", {
    signOut: signOut,
    uid: uid,
  })
  riot.mount("calendar", {
    items: items,
    uid: uid,
    saveDay: saveData,
    deleteDay: deleteData,
    refreshData: refreshData,
    openForm: openForm,
  })
}

// Init app
const adventCalendar = {
  uid: localStorage.getItem('uid') || null,
  items: null,
  slug: null,
  token: null,
  currentYear: 2017
}
const defaultItems = factoryDefaultItems(adventCalendar.currentYear)

// Trigger app start
adventCalendar.items = loadCache()
renderApp()
refreshData()
