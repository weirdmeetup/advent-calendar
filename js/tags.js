'use strict';

riot.tag2('calendar', '<table> <thead> <tr> <td>Sun</td> <td>Mon</td> <td>Tue</td> <td>Wed</td> <td>Thr</td> <td>Fri</td> <td>Sat</td> </tr> </thead> <tbody> <tr each="{items}" data-is="week"></tr> </tbody> </table> <div class="text-right served-by"> <a href="http://koalabot-weirdmeetup.herokuapp.com/slack" target="_blank"> <img src="./src/img/weird-logo.png" class="img-banner"> </a> <p> Developed by <b>haruair∙shia∙minieetea</b> </p> </div>', '', '', function (opts) {
  this.items = opts.items;
  this.username = opts.username;
  this.openForm = opts.openForm;
});

riot.tag2('day', '<div class="cell-inner"> <div class="cell-header">{date.getDate()}</div> <div class="cell-body" if="{!this.isAdvent()}"></div> <div class="cell-body" if="{this.isAdvent() && isEmpty()}"> <a href="#" onclick="{openForm}">예약하기</a> </div> <div class="cell-body" if="{this.isAdvent() && this.isPublic() && !isEmpty()}"> {username}님<br> <a href="{link}" target="_blank" class="{text-strike: this.isPunked()}">{subject}</a><br> <span class="text-small" if="{isOwned()}"> <a href="#" onclick="{openForm}">고치기</a> / <a href="#" onclick="{delete}">취소하기</a> </span> </div> <div class="cell-body" if="{this.isAdvent() && !this.isPublic() && !isEmpty()}"> {username}님<br> {subject}<br> <span class="text-small" if="{isOwned()}"> <a href="#" onclick="{openForm}">고치기</a> / <a href="#" onclick="{delete}">취소하기</a> </span> </div> </div>', '', '', function (opts) {

  var localDate = new Date();
  var offset = localDate.getTimezoneOffset();
  var shift = localDate.getMinutes() + offset + 540;
  localDate.setMinutes(shift);
  this.localDate = localDate;

  this.isEmpty = function () {
    return this.username === "";
  }.bind(this);

  this.isPunked = function () {
    return this.link === "" || this.link === null;
  }.bind(this);

  this.isAdvent = function () {

    return this.date.getMonth() == 11 && this.date.getDate() < 26;
  }.bind(this);

  this.isPublic = function () {
    return Number(this.date) <= Number(this.localDate);
  }.bind(this);

  this.isOwned = function () {
    return this.calendar().username === this.username;
  }.bind(this);

  this.delete = function () {
    var _this = this;

    vex.dialog.confirm({
      message: "정말로 취소하시겠어요?",
      callback: function callback(value) {
        if (!value) {
          return;
        }
        _this.calendar().opts.deleteDay(_this.id);
      }
    });
  }.bind(this);

  this.openForm = function () {
    var _this2 = this;

    if (!this.calendar().username) {
      vex.dialog.alert("로그인해주세요.");return;
    }

    var data = {
      subject: this.subject || "",
      link: this.link || ""
    };

    this.calendar().openForm(data, function (newData) {
      if (!newData) {
        return;
      }
      var day = _this2.day;
      var subject = newData.subject;
      var link = newData.link;

      if (_this2.id) {
        return _this2.calendar().opts.updateDay(_this2.id, day, subject, link);
      } else {
        return _this2.calendar().opts.saveDay(day, subject, link);
      }
    });
  }.bind(this);

  this.calendar = function () {
    return this.parent.parent;
  }.bind(this);
});

riot.tag2('header-nav', '<a href="/history.html" target="_blank" class="navbar float-left"><img src="../src/img/btn-previous.png"></a> <div class="navbar float-right"> <a if="{!this.opts.username}" href="https://www.weirdx.io/api/o/authorize/?client_id=6BiCpLw9xpCxdjleWXSB1jsapi3vndsMIbmMmRJS&scope=advent%20account_info&response_type=code&state=advent"><img src="../src/img/btn-login.png"></a> <a if="{this.opts.username}" href="#" onclick="{clkSignOut}"><img src="../src/img/btn-logout.png"></a> </div>', '', '', function (opts) {
  this.clkSignOut = function () {
    this.opts.signOut();
  }.bind(this);
});

riot.tag2('week', '<td each="{days}" data-is="day" class="cell"></td>', '', '', function (opts) {});