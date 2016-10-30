<calendar>
  <h1 class="text-center">Weird Advent Calendar 2016</h1>
  <section>
    <p>
      Advent Calendar는 카톨릭 달력에서 말하는 대림절(12/1~24)을 의미ㅎ...
      자세한 것은
      <a href="https://www.google.co.kr/search?q=대림절" target="_blank">
      구글을 참고</a>해보세요. <del>검색을 생활화 합시다</del>
    </p>
    <p>
      많은 온라인 커뮤니티들은 이 캘린더 형식을 빌어 의미있는 글을 연재하곤
      하는데, 이상한모임도 좀 낯설지만 의미있는 기념을 해보려고 합니다.
    </p>
    <p>
      새해만 되면 '올해는 책 좀 읽어야지'하지만 실행하는 것은 쉽지 않지요.
      작심 삼일만에 책만 몽땅 구입하고, 결국 끝까지 읽는 비율은 많지 않습니다.
      그래서 못다 이룬 새해 목표를 연말 즈음 이루어드리고자
      <font color="red">올해는 책을 읽었습니다</font> 컨셉으로 독후감을
      연재하고자 합니다. 신청은 이상한모임 필진이 아니더라도 블로그가 있다면
      누구나 할 수 있습니다.</p>
    <p>
      부디 여러분의 뽐뿌가 2017년 새해 다짐을 위한 버킷리스트로 활용되길.
      아듀 2016, 해피뉴이어 2017!
    </p>
  </section>

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

  <h5 class="text-right">Powered by WEIRDMEETUP</h5>

  <script>
    this.items = opts.items
    this.uid = opts.uid
  </script>
</calendar>
