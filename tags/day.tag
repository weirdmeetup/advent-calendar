<day>
  <div class="cell-inner">
    <div class="cell-header">{ day }</div>

    <div class="cell-body" if={ day > 25 }></div>
    <div class="cell-body" if={ day < 26 && isEmpty() }>
      <a href="#" if={ !formOpened } onclick={ openNewForm }>예약하기</a>
    </div>
    <div class="cell-body" if={ day < 26 && !isEmpty() }>
        { author }님<br>
        <a href={url} target="_blank">{title}</a><br>
        <span if={ isOwned() }>
          <a href="#" if={ !formOpened } onclick={ editForm }>고치기</a>
          <a href="#" if={ !formOpened } onclick={ delete }>취소하기</a>
        </span>
    </div>
    <div if={ formOpened }>
      <br>
      <input name="day[id]" type="hidden" value={ day }>
      <input name="day[author]" type="text" placeholder="작성자 이름">
      <input name="day[title]" type="text" placeholder="제목">
      <input name="day[url]" type="text" placeholder="URL">
      <a href="#" onclick={ submit }>제출하기</a>
      <a href="#" onclick={ closeForm }>닫기</a>
    </div>
  </div>

  <script>
    this.formOpened = false

    isEmpty() {
      return this.author === ""
    }

    isOwned() {
      return this.parent.parent.uid === this.uid
    }

    submit() {
      const day = this["day[id]"].value
      const author = this["day[author]"].value
      const title = this["day[title]"].value
      const url = this["day[url]"].value

      this.parent.parent.opts.saveDay(day, author, title, url)
      this.parent.parent.opts.loadData()
      return false
    }

    delete() {
      if(!confirm("정말로 취소하시겠어요?")) { return }
      this.parent.parent.opts.deleteDay(this.day)
      this.parent.parent.opts.loadData()
    }

    closeForm() {
      this.formOpened = false
    }

    openNewForm() {
      if(!this.parent.uid) { alert("로그인해주세요."); return }
      this.formOpened = true
    }

    editForm() {
      if(!this.parent.uid) { alert("Please log-in"); return }

      this["day[author]"].value = this.author
      this["day[title]"].value = this.title
      this["day[url]"].value = this.url
      this.formOpened = true
    }
  </script>
</day>
