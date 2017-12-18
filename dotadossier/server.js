'use strict'

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL)

// client.connect();
// client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());

app.get('/', (req, res) => res.send('hello world'))

app.get('*', (req, res) => res.redirect('/'))

app.listen(PORT, () => console.log(`listening on port : ${PORT}`))