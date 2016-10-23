<user-status>
  <a if={ !this.opts.logined } href="#" onclick={ clkSignIn }>Log-in</a>
  <a if={ this.opts.logined } href="#" onclick={ clkSignOut }>Log-out</a>

  <script>
  clkSignIn() {
    this.opts.signIn()
  }
  clkSignOut() {
    this.opts.signOut()
  }
  </script>
</user-status>
