const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const qldb_config = require('./config.js');
const qldb = require('qldb').default;
const ionize = require('qldb').ionize;

const QuantumClient = new qldb({
  accessKey: qldb_config.ACCESS_KEY_ID,
  secretKey: qldb_config.SECRET_KEY,
  region: qldb_config.REGION,
  ledger: qldb_config.LEDGER_NAME,
});

console.log(QuantumClient);

app.get('/', (req, res) => {
  res.send('Person Searcher API');
});

app.get('/api/people/', async function (req, res) {
  console.log(`Query All People`);
  try {
    const response = await QuantumClient.execute('SELECT * FROM Person');
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/search-person/', async function (req, res) {
  console.log(`Query Person`);
  console.log(req.query.searchField);
  console.log(req.query.value);
  try {
    const response = await QuantumClient.execute(`SELECT * FROM Person AS m WHERE m.${req.query.searchField} = '${req.query.value}'`);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/person-history/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`SELECT * FROM history(Person) AS m WHERE m.data.${req.query.filterField} = '${req.query.filterValue}'`);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/search/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`SELECT * FROM Movies AS m WHERE m.${req.query.searchField} = '${req.query.value}'`);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/searchById/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`SELECT * FROM Movies AS r BY rid WHERE rid = '${req.query.id}'`);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new person
app.post('/api/create-person/', async function (req, res) {
  console.log(`Create Person`);
  console.log(req.body);
  try {
    const person = req.body;
    const response = await QuantumClient.execute(`INSERT INTO Person ${ionize(person)}`);
    res.send(`Document Created.. ${response}`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Update a person
app.put('/api/update-person/', async function (req, res) {
  console.log(`Update Person`);
  console.log(req.body.field);
  console.log(req.body.value);

  try {
    const response = await QuantumClient.execute(`UPDATE Person AS m SET m.${req.body.field} = '${req.body.value}' WHERE m.${req.body.filterField}= '${req.body.filterValue}'`);
    console.log(response);
    res.send(`Document Updated`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new movie
app.post('/api/create/', async function (req, res) {
  console.log(req.body);
  try {
    const movie = req.body;
    const response = await QuantumClient.execute(`INSERT INTO Movies ${ionize(movie)}`);
    res.send(`Document Created.. ${response}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/api/update/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`UPDATE Movies AS m SET m.${req.body.field} = '${req.body.value}' WHERE m.${req.body.filterField}= '${req.body.filterValue}'`);
    res.send(`Document Updated`);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/api/delete/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`DELETE FROM Movies AS m WHERE m[${req.body.filterField}] = ${req.body.filterValue}`);
    res.status(200).send('Deleted Document Successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/getHistory/', async function (req, res) {
  try {
    const response = await QuantumClient.execute(`SELECT * FROM history(Movies) AS m WHERE m.data.${req.query.filterField} = '${req.query.filterValue}'`);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running at 3000..');
});
