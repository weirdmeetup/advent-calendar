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
      window.localStorage.setItem('access_token', json.access_token)
      window.localStorage.setItem('refresh_token', json.refresh_token)
      window.localStorage.setItem('expired_at', Number(new Date()) + json.expires_in * 1000)
      window.localStorage.removeItem('code')
      window.localStorage.removeItem('state')
      accountInfo()
    }
  })
}

const isTokenExpired = () => {
  if (!window.localStorage.getItem('access_token')) { return false }
  if (!window.localStorage.getItem('expired_at')) { return false }
  if (!window.localStorage.getItem('refresh_token')) { return false }

  const expiredAt = window.localStorage.getItem('expired_at')
  if (Number(expiredAt) > Number(new Date)) { return false }
  return true
}

const refreshToken = () => {
  const data = new FormData();
  data.append('client_id', '6BiCpLw9xpCxdjleWXSB1jsapi3vndsMIbmMmRJS')
  data.append('client_secret', 'VSP60KtPaBLAuY7pQ2FUH9j0r12CvDfbfOzeBJejoK5bdlpmUbc44tWrkIwIb0gs9yo1vBthNxC0srdEix4QCqF6DiPQH3jshk3JXwssA5Cz6TR40fuI4I5xpjcK5F63')
  data.append('grant_type', 'refresh_token')
  data.append('redirect_uri', 'http://localhost:8000/callback.html')
  data.append('refresh_token', window.localStorage.getItem('refresh_token'))

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
      window.localStorage.setItem('access_token', json.access_token)
      window.localStorage.setItem('refresh_token', json.refresh_token)
      window.localStorage.setItem('expired_at', Number(new Date()) + json.expires_in * 1000)
    }
  })
}

// Account info
const accountInfo = () => {
  return fetch(
    `https://www.weirdx.io/api/account/info`,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      }),
    }
  ).then(res => {
    return res.json()
  }).then(json => {
    if (json.username) {
      window.localStorage.setItem('username', json.username)
    } else {
      signOut()
    }
  })
}

// CRUD functions
const saveData = (day, subject, link) => {
  const dayStr = day < 10 ? `0${day}` : day

  const data = new FormData();
  data.append('booked_at', `${adventCalendar.currentYear}-12-${dayStr}`)
  data.append('subject', subject)
  data.append('link', link || '')

  return fetch(
    `https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions/`,
    {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      }),
      body: data
    }
  ).then(res => {
    refreshData()
  })
}

const updateData = (id, day, subject, link) => {
  const dayStr = day < 10 ? `0${day}` : day

  const data = new FormData();
  data.append('booked_at', `${adventCalendar.currentYear}-12-${dayStr}`)
  data.append('subject', subject)
  data.append('link', link || '')

  return fetch(
    `https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions/${id}/`,
    {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      }),
      body: data
    }
  ).then(() => {
    refreshData()
  })
}

const deleteData = id => {
  return fetch(
    `https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions/${id}/`,
    {
      method: 'DELETE',
      mode: 'cors',
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      })
    }
  ).then(() => {
    refreshData()
  })
}

const refreshData = () => {
  return fetch(`https://www.weirdx.io/api/advent/${adventCalendar.slug}/devotions/`).then(res => {
    return res.json()
  }).then(devotions => {
    const items = []

    for (let key in devotions) {
      items.push(devotions[key])
    }
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
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('username')
  adventCalendar.username = null
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
        username: "",
        subject: "",
        link: ""
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

  for(let i = 0; i != ensuredFetchedItems.length; i++) {
    const item = ensuredFetchedItems[i]
    const day = Number(item.booked_at.split('-')[2])
    const index = day + offset
    const { date } = items[index]
    items[index] = item
    item.date = date
    item.day = day
  }

  return groupItemsByWeek(items)
}
// End Utility

// Setup Form
const openForm = (defaultData, cb) => {
  dialog = vex.dialog.open({
    showCloseButton: false,
    message: "필요한 정보를 입력해주세요.",
    input: [
      `<input name="subject" type="text" placeholder="제목" value="${defaultData.subject}" required />`,
      `<input name="link" type="text" placeholder="URL" value="${defaultData.link}"/>`
    ].join(""),
    buttons: [
      {text: "예약하기", type: "submit", className: "vex-dialog-button-primary", click: vex.dialog.buttons.YES.click},
      {text: "취소하기", type: "button", className: "vex-dialog-button-secondary", click: vex.dialog.buttons.NO.click}
    ],
    callback: cb,
  })
}

const renderApp = () => {
  const username = adventCalendar.username
  const items = adventCalendar.items

  riot.mount("header-nav", {
    signOut: signOut,
    username: username,
  })
  riot.mount("calendar", {
    items: items,
    username: username,
    saveDay: saveData,
    updateDay: updateData,
    deleteDay: deleteData,
    openForm: openForm,
  })
}

// Init app
const adventCalendar = {
  username: localStorage.getItem('username') || null,
  items: null,
  slug: null,
  currentYear: 2017,
  slug: '2017-normal-advent'
}
const defaultItems = factoryDefaultItems(adventCalendar.currentYear)

// App start
adventCalendar.items = loadCache()
renderApp()
refreshData()

// Redirected from callback
if (localStorage.getItem('code')) {
  authUser()
  if (localStorage.getItem('username')) {
    adventCalendar.username = localStorage.getItem('username')
  }
} else if (isTokenExpired()) {
  refreshToken().then(() => {
    renderApp()
  })
} else {
  accountInfo()
}
