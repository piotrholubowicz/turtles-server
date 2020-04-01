const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(bodyParser.json()) // for parsing application/json

const corsOptions = {
  exposedHeaders: [
    'Cache-Control',
    'Content-Language',
    'Content-Length',
    'Content-Type',
    'Expires',
    'Last-Modified',
    'Pragma',
    'Etag'
  ],
}
app.use(cors(corsOptions))

var games = new Map();

var nextId = 100;

app.get('/', (_, res) => {
  res.send('Welcome to the Turtle Repository!')
});

app.get('/games', (_, res) => {
  res.json([...games.values()]);
});

app.get('/games/:id', (req, res) => {
  const game = games.get(+req.params.id);
  if (!game) {
    return res.sendStatus(404);
  }
  res.json(game);
});

app.post('/games', (req, res) => {
  var game = req.body;
  const error = validateAddGame(game);
  if (error) {
    return res.status(400).send(error);
  }
  const id = nextId++;
  game['id'] = id;
  games.set(id, game);
  res.json(game);
});

app.put('/games/:id', (req, res) => {
  var game = req.body;
  const id = +req.params.id;
  const error = validateUpdateGame(game, id);
  if (error) {
    return res.status(400).send(error);
  }
  if (!games.has(id)) {
    return res.sendStatus(404)
  }
  games.set(id, game);
  res.sendStatus(204);
});

app.delete('/games/:id', (req, res) => {
  const id = +req.params.id;
  if (!games.has(id)) {
    return res.sendStatus(404)
  }
  delete games.delete(id);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server started');
});

function validateAddGame(game) {
  if (typeof game['id'] !== 'undefined') { 
    return 'You cannot provide an id when adding a new game.\n'
  };
  return validateFields(game);
}

function validateUpdateGame(game, id) {
  if (typeof game['id'] === 'undefined') { 
      return 'Field not found: id.\n'
  };
  if (game['id'] != id) { 
      return 'Id in the body and in the path don\'t match.\n'
  };
  return validateFields(game);
}

function validateFields(game) {
  for(const field of ['players', 'colors', 'hands', 'deck', 'discarded', 'board', 'active_player']) {
    if (typeof game[field] === 'undefined') { 
      return 'Field not found: ' + field + '.\n'
    };
  }
  return undefined;
}
