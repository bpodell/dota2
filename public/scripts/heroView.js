heroView.initIndexPage () => {
   $.get('/heroes')
   .then(data => let heroes = data.map(hero => new Hero(hero)))
   .catch(console.error)
}