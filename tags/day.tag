<day>
  <div class="cell-inner">
    <div class="cell-header">{ date.getDate() }</div>

    <div class="cell-body" if={ !this.isAdvent() }></div>
    <div class="cell-body" if={ this.isAdvent() }>
      { author }님<br>
      <a href={url} target="_blank">{title}</a><br>
    </div>
  </div>

  <script>
    isAdvent() {
      // 11 is December
      return this.date.getMonth() == 11 && this.date.getDate() < 26
    }
  </script>
</day>
