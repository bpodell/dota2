
(function(module) {


    heroView.initIndexPage () => {
        $.get('/heroes')
        .then(data => Hero.all = data.map(hero => new app.Hero(hero)))
        .catch(console.error)
        }
    module.heroView = heroView
})(app);