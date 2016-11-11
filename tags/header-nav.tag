<header-nav>
  <a href="/history.html" target="_blank" class="navbar float-left"><img src="../src/img/btn-previous.png"/></a>
  <div class="navbar float-right">
    <a if={ !this.opts.uid } href="#" onclick={ clkSignIn }><img src="../src/img/btn-login.png"/></a>
    <a if={ this.opts.uid } href="#" onclick={ clkSignOut }><img src="../src/img/btn-logout.png"/></a>
  </div>

  <script>
  clkSignIn() {
    this.opts.signIn()
  }
  clkSignOut() {
    this.opts.signOut()
  }
  </script>
</header-nav>
