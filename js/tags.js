riot.tag2('calendar', '<h1>Weird Advent Calendar 2016</h1> <p>Here will be placed some text</p> <ul> <day each="{items}"></day> </ul>', '', '', function(opts) {
    this.items = opts.items
    this.uid = opts.uid
});

riot.tag2('day', '<li> <span if="{isEmpty()}"> {day}일: 비어있습니다. <a href="#" if="{!formOpened}" onclick="{openNewForm}">등록하기</a> </span> <span if="{!isEmpty()}"> {day}일: {author}님의 <a href="{url}" target="_blank">{title}</a> <span if="{isOwned()}"> <a href="#" if="{!formOpened}" onclick="{editForm}">고치기</a> <a href="#" if="{!formOpened}" onclick="{delete}">취소하기</a> </span> </span> <br> <div if="{formOpened}"> <input name="day[id]" type="hidden" value="{day}"> <input name="day[author]" type="text" placeholder="작성자 이름"> <input name="day[title]" type="text" placeholder="제목"> <input name="day[url]" type="text" placeholder="URL"> <a href="#" onclick="{submit}">제출하기</a> <a href="#" onclick="{closeForm}">닫기</a> </div> </li>', '', '', function(opts) {
    this.formOpened = false

    this.isEmpty = function() {
      return this.author === ""
    }.bind(this)

    this.isOwned = function() {
      return this.parent.uid === this.uid
    }.bind(this)

    this.submit = function() {
      const day = this["day[id]"].value
      const author = this["day[author]"].value
      const title = this["day[title]"].value
      const url = this["day[url]"].value

      this.parent.opts.saveDay(day, author, title, url)
      this.parent.opts.loadData()
      return false
    }.bind(this)

    this.delete = function() {
      this.parent.opts.deleteDay(this.day)
      this.parent.opts.loadData()
    }.bind(this)

    this.closeForm = function() {
      this.formOpened = false
    }.bind(this)

    this.openNewForm = function() {
      if(!this.parent.uid) { alert("Please log-in"); return }
      this.formOpened = true
    }.bind(this)

    this.editForm = function() {
      if(!this.parent.uid) { alert("Please log-in"); return }

      this["day[author]"].value = this.author
      this["day[title]"].value = this.title
      this["day[url]"].value = this.url
      this.formOpened = true
    }.bind(this)
});

riot.tag2('user-status', '<a if="{!this.opts.uid}" href="#" onclick="{clkSignIn}">Log-in</a> <a if="{this.opts.uid}" href="#" onclick="{clkSignOut}">Log-out</a>', '', '', function(opts) {
  this.clkSignIn = function() {
    this.opts.signIn()
  }.bind(this)
  this.clkSignOut = function() {
    this.opts.signOut()
  }.bind(this)
});
