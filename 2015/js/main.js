var Day = Backbone.Model.extend({
  initialize: function (params) {
    this.set('day', params.day);
    this.set('author', params.author);
    this.set('empty', params.empty);
    this.set('title', params.title);
    this.set('link', params.link);
    this.set('force', params.force);
    var date = new Date();
    this.set('linkActive', true);
  }
});
var Days = Backbone.Collection.extend({ model: Day });

var CalendarView = Backbone.View.extend({
  el: $('#table-calendar'),

  initialize: function (days) {
    this.dayTemplate = _.template($('#cell-day').html());
    this.weekTemplate = _.template($('#cell-week').html());

    this.collection = new Days();
    _.each(days, function(day) {
      this.collection.add(new Day(day));
    }, this);
    this.render();
  },

  render: function () {
    var table = this.collection.reduce(function (table, day) {
      var lastRow = _.last(table);
      if (_.size(_.last(table)) == 7) {
        lastRow = [];
        table.push(lastRow);
      }
      lastRow.push(this.renderCelltoHtml(day));
      return table;
    }, [[]], this);

    html = _.chain(table)
      .map(function (row) {
      return this.weekTemplate({days: row.join('')});
      }, this).join('').value();

    this.$el.html(html);
    return this;
  },

  renderCelltoHtml: function (day) {
    return this.dayTemplate(day.attributes);
  }
});

$(document).ready(function () {
  var id = '1S0wZbXqyY6dASpodIBaL5731UYdtIOoocWA3TCCQZ1s';
  var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json';

  $.getJSON(url, function (json) {
    var list = _.each(json.feed.entry, function (row) {
      var day = Number(row['gsx$게제일'].$t.replace('일', ''))
      if (day == 0) {return;};
      window.calendar[day + 1] = {
        day: day,
        author: row['gsx$이메일슬랙id'].$t.split(' ')[1],
        title: row['gsx$도서제목'].$t,
        link: row['gsx$게제할블로그주소'].$t
      };
    })
    new CalendarView(window.calendar);
    var height = $(document).height() + 40;
    $('#snow').height(height + 'px');
  });
});