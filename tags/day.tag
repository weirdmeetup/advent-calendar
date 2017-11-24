<day>
  <div class="cell-inner">
    <div class="cell-header">{ date.getDate() }</div>

    <div class="cell-body" if={ !this.isAdvent() }></div>
    <div class="cell-body" if={ this.isAdvent() && isEmpty() }>
      <a href="#" onclick={ openForm }>예약하기</a>
    </div>
    <div class="cell-body" if={ this.isAdvent() && this.isPublic() && !isEmpty() }>
      { username }님<br>
      <a href={link} target="_blank" class={text-strike: this.isPunked()}>{subject}</a><br>
      <span class="text-small" if={ isOwned() }>
        <a href="#" onclick={ openForm }>고치기</a> /
        <a href="#" onclick={ delete }>취소하기</a>
      </span>
    </div>
    <div class="cell-body" if={ this.isAdvent() && !this.isPublic() && !isEmpty() }>
      { username }님<br>
      { subject }<br>
      <span class="text-small" if={ isOwned() }>
        <a href="#" onclick={ openForm }>고치기</a> /
        <a href="#" onclick={ delete }>취소하기</a>
      </span>
    </div>
  </div>

  <script>
    // Check Date like +09:00
    // Meaning to say, Link will be opened at 0 am +09:00 in all the world.
    const localDate = new Date()
    const offset = localDate.getTimezoneOffset()
    const shift = localDate.getMinutes() + offset + 540
    localDate.setMinutes(shift)
    this.localDate = localDate

    isEmpty() {
      return this.username === ""
    }

    isPunked() {
      return this.link === ""
    }

    isAdvent() {
      // 11 is December
      return this.date.getMonth() == 11 && this.date.getDate() < 26
    }

    isPublic() {
      return Number(this.date) <= Number(this.localDate)
    }

    isOwned() {
      return this.calendar().username === this.username
    }

    delete() {
      vex.dialog.confirm({
        message: "정말로 취소하시겠어요?",
        callback: value => {
          if(!value) { return }
          this.calendar().opts.deleteDay(this.id)
        }
      })
    }

    openForm() {
      if(!this.calendar().username) { vex.dialog.alert("로그인해주세요."); return }

      const data = {
        subject: this.subject || "",
        link: this.link || ""
      }

      this.calendar().openForm(data, newData => {
        if (!newData) { return }
        const day = this.day
        const subject = newData.subject
        const link = newData.link

        if (this.id) {
          return this.calendar().opts.updateDay(this.id, day, subject, link)
        } else {
          return this.calendar().opts.saveDay(day, subject, link)
        }
      })
    }

    calendar() {
      return this.parent.parent
    }
  </script>
</day>
