<day>
  <li>
    <span if={ isEmpty() }>
      { day }일: 비어있습니다.
      <a href="#" if={ !formOpened } onclick={ openNewForm }>등록하기</a>
    </span>
    <span if={ !isEmpty() }>
      { day }일: { author }님의 <a href={url} target="_blank">{title}</a>
      <span if={ isOwned() }>
        <a href="#" if={ !formOpened } onclick={ editForm }>고치기</a>
        <a href="#" if={ !formOpened } onclick={ delete }>취소하기</a>
      </span>
    </span>
    <br>
    <div if={ formOpened }>
      <input name="day[id]" type="hidden" value={ day }>
      <input name="day[author]" type="text" placeholder="작성자 이름">
      <input name="day[title]" type="text" placeholder="제목">
      <input name="day[url]" type="text" placeholder="URL">
      <a href="#" onclick={ submit }>제출하기</a>
      <a href="#" onclick={ closeForm }>닫기</a>
    </div>
  </li>

  <script>
    this.formOpened = false

    isEmpty() {
      return this.author === ""
    }

    isOwned() {
      return this.parent.uid === this.uid
    }

    submit() {
      const day = this["day[id]"].value
      const author = this["day[author]"].value
      const title = this["day[title]"].value
      const url = this["day[url]"].value

      this.parent.opts.saveDay(day, author, title, url)
      this.parent.opts.loadData()
      return false
    }

    delete() {
      this.parent.opts.deleteDay(this.day)
      this.parent.opts.loadData()
    }

    closeForm() {
      this.formOpened = false
    }

    openNewForm() {
      if(!this.parent.uid) { alert("Please log-in"); return }
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
