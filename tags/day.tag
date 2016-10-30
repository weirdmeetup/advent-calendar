<day>
  <div class="cell-inner">
    <div class="cell-header">{ day }</div>

    <div class="cell-body" if={ day > 25 }></div>
    <div class="cell-body" if={ day < 26 && isEmpty() }>
      <a href="#" onclick={ openForm }>예약하기</a>
    </div>
    <div class="cell-body" if={ day < 26 && !isEmpty() }>
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

    isOwned() {
      return this.parent.parent.uid === this.uid
    }

    delete() {
      vex.dialog.confirm({
        message: "정말로 취소하시겠어요?",
        callback: value => {
          if(!value) { return }
          this.parent.parent.opts.deleteDay(this.day)
          this.parent.parent.opts.loadData()
        }
      })
    }

    openForm() {
      if(!this.parent.uid) { vex.dialog.alert("로그인해주세요."); return }

      const data = {
        author: this.author || "",
        title: this.title || "",
        url: this.url || ""
      }

      this.parent.parent.openForm(data, data => {
        if (!data) { return }
        const day = this.day
        const author = data.author
        const title = data.title
        const url = data.url

        this.parent.parent.opts.saveDay(day, author, title, url)
        this.parent.parent.opts.loadData()
      })
    }
  </script>
</day>
