<day>
  <div class="cell-inner">
    <div class="cell-header">{ date.getDate() }</div>

    <div class="cell-body" if={ !this.isDecember() }></div>
    <div class="cell-body" if={ this.isDecember() && isEmpty() }>
      <a href="#" onclick={ openForm }>예약하기</a>
    </div>
    <div class="cell-body" if={ this.isDecember() && !isEmpty() }>
      { author }님<br>
      <a href={url} target="_blank">{title}</a><br>
      <span class="text-small" if={ isOwned() }>
        <a href="#" onclick={ openForm }>고치기</a> /
        <a href="#" onclick={ delete }>취소하기</a>
      </span>
    </div>
  </div>

  <script>
    isEmpty() {
      return this.author === ""
    }

    isDecember() {
      return this.date.getMonth() == 11
    }

    isOwned() {
      return this.calendar().uid === this.uid
    }

    delete() {
      vex.dialog.confirm({
        message: "정말로 취소하시겠어요?",
        callback: value => {
          if(!value) { return }
          this.calendar().opts.deleteDay(this.day)
          this.calendar().opts.refresh()
        }
      })
    }

    openForm() {
      if(!this.calendar().uid) { vex.dialog.alert("로그인해주세요."); return }

      const data = {
        author: this.author || "",
        title: this.title || "",
        url: this.url || ""
      }

      this.calendar().openForm(data, data => {
        if (!data) { return }
        const day = this.day
        const author = data.author
        const title = data.title
        const url = data.url

        this.calendar().opts.saveDay(day, author, title, url)
        this.calendar().opts.refresh()
      })
    }

    calendar() {
      return this.parent.parent
    }
  </script>
</day>
