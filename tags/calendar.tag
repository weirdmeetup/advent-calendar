<calendar>
  <table>
    <thead>
      <tr>
        <td>Sun</td>
        <td>Mon</td>
        <td>Tue</td>
        <td>Wed</td>
        <td>Thr</td>
        <td>Fri</td>
        <td>Sat</td>
      </tr>
    </thead>

    <tbody>
      <tr each={ items } data-is="week"></tr>
    </tbody>
  </table>

  <div class="text-right served-by">
    <a href="http://koalabot-weirdmeetup.herokuapp.com/slack" target="_blank">
      <img src="./src/img/weird-logo.png" class="img-banner">
    </a>
    <p>
      Developed by <b>shia∙minieetea</b>
    </p>
  </div>

  <script>
    this.items = opts.items
    this.uid = opts.uid
  </script>
</calendar>
