riot.tag2('calendar', '<h1 class="text-center">Weird Advent Calendar 2016</h1> <section> <p> Advent Calendar는 카톨릭 달력에서 말하는 대림절(12/1~24)을 의미ㅎ... 자세한 것은 <a href="https://www.google.co.kr/search?q=대림절" target="_blank"> 구글을 참고</a>해보세요. <del>검색을 생활화 합시다</del> </p> <p> 많은 온라인 커뮤니티들은 이 캘린더 형식을 빌어 의미있는 글을 연재하곤 하는데, 이상한모임도 좀 낯설지만 의미있는 기념을 해보려고 합니다. </p> <p> 새해만 되면 \'올해는 책 좀 읽어야지\'하지만 실행하는 것은 쉽지 않지요. 작심 삼일만에 책만 몽땅 구입하고, 결국 끝까지 읽는 비율은 많지 않습니다. 그래서 못다 이룬 새해 목표를 연말 즈음 이루어드리고자 <font color="red">올해는 책을 읽었습니다</font> 컨셉으로 독후감을 연재하고자 합니다. 신청은 이상한모임 필진이 아니더라도 블로그가 있다면 누구나 할 수 있습니다.</p> <p> 부디 여러분의 뽐뿌가 2017년 새해 다짐을 위한 버킷리스트로 활용되길. 아듀 2016, 해피뉴이어 2017! </p> </section> <table> <thead> <tr> <td>Sun</td> <td>Mon</td> <td>Tue</td> <td>Wed</td> <td>Thr</td> <td>Fri</td> <td>Sat</td> </tr> </thead> <tbody> <tr each="{items}" data-is="week"></tr> </tbody> </table> <h5 class="text-right">Powered by WEIRDMEETUP</h5>', '', '', function(opts) {
    this.items = opts.items
    this.uid = opts.uid
});

riot.tag2('day', '<div class="cell-inner"> <div class="cell-header">{day}</div> <div class="cell-body" if="{day > 25}"></div> <div class="cell-body" if="{day < 26 && isEmpty()}"> <a href="#" if="{!formOpened}" onclick="{openNewForm}">예약하기</a> </div> <div class="cell-body" if="{day < 26 && !isEmpty()}"> {author}님<br> <a href="{url}" target="_blank">{title}</a><br> <span if="{isOwned()}"> <a href="#" if="{!formOpened}" onclick="{editForm}">고치기</a> <a href="#" if="{!formOpened}" onclick="{delete}">취소하기</a> </span> </div> <div if="{formOpened}"> <br> <input name="day[id]" type="hidden" value="{day}"> <input name="day[author]" type="text" placeholder="작성자 이름"> <input name="day[title]" type="text" placeholder="제목"> <input name="day[url]" type="text" placeholder="URL"> <a href="#" onclick="{submit}">제출하기</a> <a href="#" onclick="{closeForm}">닫기</a> </div> </div>', '', '', function(opts) {
    this.formOpened = false

    this.isEmpty = function() {
      return this.author === ""
    }.bind(this)

    this.isOwned = function() {
      return this.parent.parent.uid === this.uid
    }.bind(this)

    this.submit = function() {
      const day = this["day[id]"].value
      const author = this["day[author]"].value
      const title = this["day[title]"].value
      const url = this["day[url]"].value

      this.parent.parent.opts.saveDay(day, author, title, url)
      this.parent.parent.opts.loadData()
      return false
    }.bind(this)

    this.delete = function() {
      if(!confirm("정말로 취소하시겠어요?")) { return }
      this.parent.parent.opts.deleteDay(this.day)
      this.parent.parent.opts.loadData()
    }.bind(this)

    this.closeForm = function() {
      this.formOpened = false
    }.bind(this)

    this.openNewForm = function() {
      if(!this.parent.uid) { alert("로그인해주세요."); return }
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

riot.tag2('header-nav', '<a href="/history.html" target="_blank" class="float-left button">이전 달력 보기</a> <div class="float-right"> <a if="{!this.opts.uid}" class="button button-primary" href="#" onclick="{clkSignIn}">Log-in</a> <a if="{this.opts.uid}" class="button" href="#" onclick="{clkSignOut}">Log-out</a>', '', '', function(opts) {
  this.clkSignIn = function() {
    this.opts.signIn()
  }.bind(this)
  this.clkSignOut = function() {
    this.opts.signOut()
  }.bind(this)
});

riot.tag2('week', '<td each="{days}" data-is="day" class="cell"></td>', '', '', function(opts) {
});
