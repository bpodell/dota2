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

app.get('/pro', (req, res) => {
  superagent.get('https://api.opendota.com/api/teams?limit=16')
    .then(response => res.send(response.body))
    .catch(console.error)
})
// app.get('/etag' (req, res) => {
//   client.query(`SELECT etag_id FROM etag`)
//   .then(results => res.send(results.rows[0].etag))
//   .catch(console.error)
// })

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
                `INSERT INTO heroes(hero_id, name, img, primary_attr, roles, move_speed, turn_rate, base_health, base_health_regen, base_mana, base_mana_regen, base_armor, base_mr, base_attack_min, base_attack_max, base_str, base_agi, base_int, str_gain, agi_gain, int_gain, attack_range, projectile_speed, attack_rate, pro_win, pro_pick, pro_ban, attack_type)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) ON CONFLICT DO NOTHING;`,
                [ele.id, ele.localized_name, ele.img, ele.primary_attr, ele.roles , ele.move_speed, ele.turn_rate, ele.base_health, ele.base_health_regen, ele.base_mana, ele.base_mana_regen, ele.base_armor, ele.base_mr, ele.base_attack_min, ele.base_attack_max, ele.base_str, ele.base_agi, ele.base_int, ele.str_gain, ele.agi_gain, ele.int_gain, ele.attack_range, ele.projectile_speed, ele.attack_rate, ele.pro_win, ele.pro_pick, ele.pro_ban, ele.attack_type]
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
      img VARCHAR(255),
      primary_attr VARCHAR(10),
      roles VARCHAR(255),
      move_speed VARCHAR(10),
      turn_rate VARCHAR(10),
      base_health VARCHAR(10),
      base_health_regen VARCHAR(10),
      base_mana VARCHAR(10),
      base_mana_regen VARCHAR(10),
      base_armor VARCHAR(10),
      base_mr VARCHAR(10),
      base_attack_min VARCHAR(10),
      base_attack_max VARCHAR(10),
      base_str VARCHAR(10),
      base_agi VARCHAR(10),
      base_int VARCHAR(10),
      str_gain VARCHAR(10),
      agi_gain VARCHAR(10),
      int_gain VARCHAR(10),
      attack_range VARCHAR(10),
      projectile_speed VARCHAR(10),
      attack_rate VARCHAR(10),
      pro_win VARCHAR(10),
      pro_pick VARCHAR(10),
      pro_ban VARCHAR(10),
      attack_type VARCHAR(50)
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
    .then(result => result.rows[0] ? dbTag = result.rows[0] : dbTag = '')
  superagent.head('https://api.opendota.com/api/heroStats')
    .then((res) => {
      eTag = res.headers.etag;
      console.log(res.headers)
      console.log(eTag)
      console.log(dbTag)
      if (dbTag !== eTag) {
        client.query('TRUNCATE TABLE heroes')
          .then(loadHeroes)
      }
    })
}
