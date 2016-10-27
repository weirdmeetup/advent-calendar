<calendar>
  <h1 class="text-center">Weird Advent Calendar 2016</h1>
  <p>Here will be placed some text</p>

  <div class="row">
    <div class="two columns">Sun</div>
    <div class="two columns">Mon</div>
    <div class="two columns">Tue</div>
    <div class="two columns">Wed</div>
    <div class="two columns">Thr</div>
    <div class="two columns">Fri</div>
    <div class="two columns">Sat</div>
  </div>

  <week each="{ items }"></week>

  <script>
    this.items = opts.items
    this.uid = opts.uid
  </script>
</calendar>
