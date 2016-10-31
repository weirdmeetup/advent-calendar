<header-nav>
  <a href="/history.html" target="_blank" class="float-left button">이전 달력 보기</a>
  <div class="float-right">
  <a if={ !this.opts.uid } class="button button-primary" href="#" onclick={ clkSignIn }>Log-in</a>
  <a if={ this.opts.uid } class="button" href="#" onclick={ clkSignOut }>Log-out</a>

  <script>
  clkSignIn() {
    this.opts.signIn()
  }
  clkSignOut() {
    this.opts.signOut()
  }
  </script>
</header-nav>
