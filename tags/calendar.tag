<calendar>
  <img src="../src/img/header-title-2016.png"/>

  <section class="explain-section">
    <ul>
      <li>
        <input type="checkbox" checked>
        <i></i>
        <h2>대림절 달력이 뭐죠!</h2>
        <p>
          대림절 달력(Advent Calendar)은 크리스마스를 앞둔 4주의 대림절 기간 동안 만드는 특별한 달력입니다. 매일 매일 선물이나 과자가 들어있는 날짜를 열어가면서 크리스마스를 기다리는 거죠.
        </p>
      </li>
      <li>
        <input type="checkbox" checked>
        <i></i>
        <h2>왜 하나요?</h2>
        <p>
          요즘에는 많은 온라인 커뮤니티들이 대림절 달력의 형식을 빌려 특정한 키워드나 연관된 주제로 글을 연재하고는 합니다. 일본의 <a href="http://qiita.com/advent-calendar">Qiita</a> 에서는 벌써 352개의 달력이 생겨났네요!
        </p>
      </li>
      <li>
        <input type="checkbox" checked>
        <i></i>
        <h2>주제는요?</h2>
        <p>
          이상한모임은 올해의 한 해를 돌아보고자 합니다. 주제는 <span class="topic">올해 배운 것</span>입니다. 한 해 동안 배운 기술적인 내용도 좋고, 시행착오를 통해 배운 성장통도 좋습니다. 사람 사이의 관계나, 다양한 활동을 통해서 몸으로 배운 삶의 지혜도 좋습니다. 우리는 의미 없는 한 해를 보낸 것이 아니라 무엇이라도 돈 주고도 배우기 힘든 하나는 배운 한 해가 되었을 테니까요. 
        </p>
      </li>
      <li>
        <input type="checkbox" checked>
        <i></i>
        <h2>어떻게 참가하나요?</h2>
        <p>
          신청은 이상한모임 회원이나 기술 블로그 필진이 아니어도 누구나 참여할 수 있습니다. 주제에 공감하고, 나누고 싶은 이야기가 있고, 글을 올릴 수 있는 온라인 공간이 있다면 지금 바로 참여해보세요. (에버노트나 구글 문서도 괜찮습니다!) 등록한 날짜가 오기 전에, 글을 작성하시고 링크를 제출해주시면 됩니다. 참 쉽죠?
          <br>부디, 여러분의 교훈이 2017년의 성장을 위한 소중한 밑거름이 되길.
        </p>
      </li>
    </ul>

    <p>
      Adieu 2016, Happy new Year 2017!
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
    this.openForm = opts.openForm
  </script>
</calendar>
