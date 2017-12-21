'use strict'

let pro = {}

Pro.all = [];

function initProPage() {
  $.get('/pro')
    .then(data => {
      let filteredData = data.filter(team => team.last_match_time > 1510000000)
      let splicedData = filteredData.splice(0, 16)
      setPro(splicedData)
    })
    .catch(console.error)
}

function Pro(team) {
  Object.keys(team).forEach(key => this[key] = team[key]);

}

function setPro(proData){
  console.log('inside setPro', proData)
  Pro.all = proData.map(team => new Pro(team))
  console.log(Pro.all)
  appendProView()
}
function appendProView() {
  console.log('inside appendProView', Pro.all)
  $('.container').hide()
  $('tr').empty()
  $('#pro-view').show()
  Pro.all.forEach((team) => {
    $('#pro-view-table').append(team.toHtml())
  })
}
Pro.prototype.toHtml = function() {
  var template = Handlebars.compile($('#pro-template').text());
  return template(this);
}
// function setAll (heroData) {
// console.log(heroData)
// heroData.sort((a,b) => a.name < b.name ? -1 : 1 );
// app.Hero.all = heroData.map(hero => new app.Hero(hero))
// heroView.appendHeroView();
// }