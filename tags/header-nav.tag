<header-nav>
  <a href="/history.html" target="_blank" class="navbar float-left"><img src="../src/img/btn-previous.png"/></a>
  <div class="navbar float-right">
    <a if={ !this.opts.uid } href="https://www.weirdx.io/api/o/authorize/?client_id=6BiCpLw9xpCxdjleWXSB1jsapi3vndsMIbmMmRJS&scope=advent%20account_info&response_type=code&state=advent"><img src="../src/img/btn-login.png"/></a>
    <a if={ this.opts.uid } href="#" onclick={ clkSignOut }><img src="../src/img/btn-logout.png"/></a>
  </div>

  <script>
  clkSignOut() {
    this.opts.signOut()
  }
  </script>
</header-nav>
