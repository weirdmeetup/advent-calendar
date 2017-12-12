'use strict';

riot.tag2('calendar', '<table> <thead> <tr> <td>Sun</td> <td>Mon</td> <td>Tue</td> <td>Wed</td> <td>Thr</td> <td>Fri</td> <td>Sat</td> </tr> </thead> <tbody> <tr each="{items}" data-is="week"></tr> </tbody> </table> <div class="text-right served-by"> <a href="http://koalabot-weirdmeetup.herokuapp.com/slack" target="_blank"> <img src="./src/img/weird-logo.png" class="img-banner"> </a> <p> Developed by <b>shia∙minieetea</b> </p> </div>', '', '', function (opts) {
    this.items = opts.items;
    this.uid = opts.uid;
});

riot.tag2('day', '<div class="cell-inner"> <div class="cell-header">{date.getDate()}</div> <div class="cell-body" if="{!this.isAdvent()}"></div> <div class="cell-body" if="{this.isAdvent()}"> {author}님<br> <a href="{url}" target="_blank">{title}</a><br> </div> </div>', '', '', function (opts) {
    this.isAdvent = function () {

        return this.date.getMonth() == 11 && this.date.getDate() < 26;
    }.bind(this);
});

riot.tag2('header-nav', '<a href="/history.html" target="_blank" class="navbar float-left"><img src="../src/img/btn-previous.png"></a>', '', '', function (opts) {});

riot.tag2('week', '<td each="{days}" data-is="day" class="cell"></td>', '', '', function (opts) {});