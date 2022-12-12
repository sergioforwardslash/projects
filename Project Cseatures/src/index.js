const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql');
const path = require('path');

const port = 4201;
const config = require('./config.json');

const db = mysql.createPool(config.databaseCredentials);

const app = express();

app.use(helmet());
app.use(bodyParser.json())
app.use(cors());
app.use(morgan('combined'));

//saving files statically
app.use('/static', express.static(path.join(__dirname, 'public')))

//api call
app.post('/query', (req, res) => {
  const query = req.body.query;

  db.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(results);

      res.send(results);
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
