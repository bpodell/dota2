'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL)

app.use(express.static('./public'));

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());

app.get('/', (req, res) => res.send('hello world'))

app.get('*', (req, res) => res.redirect('/'))

loadDatabase();
app.listen(PORT, () => console.log(`listening on port : ${PORT}`))

/******************/

function loadHeroes() {
  console.log('load HEROES');
  client.query(`SELECT COUNT(*) FROM  heroes`)
    .then(results => {
      if (! parseInt(results.rows[0].count)){
        fs.readFile('./data/heroesData.json', 'utf-8', (err, fd)=> {
          JSON.parse(fd).forEach(ele => {
            client.query(
              `INSERT INTO heroes( name, image_url, primary_attr, roles, move_speed, turn_rate)
            VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING;`,
              [ele.name, ele.img, ele.primary_attr, ele.roles, ele.move_speed, ele.turn_rate]
            )
          })
        })
      }
    })
}

function loadDatabase(){
  console.log('loading database')
  client.query(`
    CREATE TABLE IF NOT EXISTS
    heroes (
      hero_id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      image_url VARCHAR(255),
      primary_attr VARCHAR(10),
      roles VARCHAR(255),
      move_speed VARCHAR(10),
      turn_rate VARCHAR(10)
    );`)
    .then(loadHeroes)
    .catch(console.error);


}
