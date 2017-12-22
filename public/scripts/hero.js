'use strict'
var app = app || {};

(function(module) {


  function Hero(heroData) {
    Object.keys(heroData).forEach(key => this[key] = heroData[key]);

  }
  Hero.all = [];
  Hero.prototype.toHtml = function() {
    var template = Handlebars.compile($('#hero-template').text());
    return template(this);
  }

  module.Hero = Hero
})(app)
