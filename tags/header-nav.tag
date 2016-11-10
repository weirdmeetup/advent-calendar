<header-nav>
  <a href="/history.html" target="_blank" class="float-left"><img src="../src/img/btn-previous.png" style="width: inherit;"/></a>
  <div class="float-right">
  <a if={ !this.opts.uid } href="#" onclick={ clkSignIn }><img src="../src/img/btn-login.png" style="width: inherit;"/></a>
  <a if={ this.opts.uid } href="#" onclick={ clkSignOut }><img src="../src/img/btn-logout.png" style="width: inherit;"/></a>

  <script>
  clkSignIn() {
    this.opts.signIn()
  }
  clkSignOut() {
    this.opts.signOut()
  }
  </script>
</header-nav>
