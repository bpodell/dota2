'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const superagent = require('superagent')
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

app.get('/heroes', (req, res) => {
  client.query(`SELECT * FROM heroes`)
    .then(results => res.send(results.rows))
    .catch(console.error)
})

app.get('/stats/:id', (req, res) => {
  let url = `https://api.opendota.com/api/benchmarks?hero_id=${req.params.id}`;
  superagent.get(url)
    .then(response => res.send(response.body))
    .catch(console.error)
})

app.get('*', (req, res) => res.redirect('/'))

createDatabase();
app.listen(PORT, () => console.log(`listening on port : ${PORT}`))

/******************/

// function loadHeroes() {
//   console.log('load HEROES');
//   client.query(`SELECT COUNT(*) FROM  heroes`)
//     .then(results => {
//       if (! parseInt(results.rows[0].count)){
//         fs.readFile('./data/heroesData.json', 'utf-8', (err, fd)=> {
//           JSON.parse(fd).forEach(ele => {
//             client.query(
//               `INSERT INTO heroes( name, image_url, primary_attr, roles, move_speed, turn_rate, hero_id)
//             VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING;`,
//               [ele.localized_name, ele.img, ele.primary_attr, ele.roles, ele.move_speed, ele.turn_rate, ele.id]
//             )
//           })
//         })
//       }
//     })
// }

function loadHeroes() {
  console.log('load heroes')
  client.query(`SELECT COUNT(*) FROM  heroes`)
    .then(results => {
      if (! parseInt(results.rows[0].count)){
        superagent.get('https://api.opendota.com/api/heroStats')
          .then(response => {
            let dbTag = response.headers.etag
            response.body.forEach(ele => {
              client.query(
                `INSERT INTO heroes( name, image_url, primary_attr, roles, move_speed, turn_rate, hero_id)
            VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING;`,
                [ele.localized_name, ele.img, ele.primary_attr, ele.roles, ele.move_speed, ele.turn_rate, ele.id]
              )
                .then(
                  client.query(
                    `TRUNCATE TABLE etag`
                  )
                    .then(
                      client.query(
                        `INSERT INTO etag (etag_id) VALUES ($1)`,
                        [dbTag]
                      )
                    )
                )
            })
          })
      }
    })
}

function createDatabase(){
  console.log('loading database')
  client.query(`
    CREATE TABLE IF NOT EXISTS
    heroes (
      hero_id VARCHAR(5),
      name VARCHAR(50),
      image_url VARCHAR(255),
      primary_attr VARCHAR(10),
      roles VARCHAR(255),
      move_speed VARCHAR(10),
      turn_rate VARCHAR(10)
    );`)
    .then(client.query(`CREATE TABLE IF NOT EXISTS
    etag (
      etag_id VARCHAR(255)
    );`))
    .then(checkHeaders)
    .catch(console.error);


}

function checkHeaders() {
  let eTag;
  let dbTag;
  client.query(`SELECT etag_id FROM etag`)
    .then(result => dbTag = result.rows[0])
  superagent.head('https://api.opendota.com/api/heroStats')
    .then((res) => {
      eTag = res.headers.etag;
      console.log(res.headers)
      console.log(eTag)
      console.log(dbTag)
      if (dbTag.etag_id !== eTag) {
        client.query('TRUNCATE TABLE heroes')
          .then(loadHeroes)
      }
    })
}
