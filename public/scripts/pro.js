'use strict';
var app = app || {};

(function(module){

  let proView = {}

  Pro.all = [];

  proView.initProPage = () => {
    $.get('/pro')
      .then(data => {
        let filteredData = data.filter(team => team.last_match_time > 1510000000)
        let splicedData = filteredData.splice(0, 16)
        proView.setPro(splicedData)
      })
      .catch(console.error)
  }

  function Pro(team) {
    Object.keys(team).forEach(key => this[key] = team[key]);

  }

  proView.setPro = (proData) => {
    Pro.all = proData.map(team => new Pro(team))
    proView.appendProView()
  }

  proView.appendProView = () => {
    $('.container').hide()
    $('tr:not(:first-child)').hide();
    $('#pro-view').show()
    Pro.all.forEach((team) => {
      $('#pro-view-table').append(team.toHtml())
    })
  }
  Pro.prototype.toHtml = function() {
    var template = Handlebars.compile($('#pro-template').text());
    return template(this);
  }

  module.Pro = Pro;
  module.proView = proView;

})(app);
