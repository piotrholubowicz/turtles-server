const express = require('express');

const app = express();

let games = new Map();
const game1 = { 'id': 234, 'players': ['Filip', 'Sebas']};
const game2 = { 'id': 300, 'players': ['Sparta']};
games.set(234, game1);
games.set(300, game2);

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.get('/games', (req, res) => {
  console.log('/games');
  res.json(games.values());
});


app.listen(3000, () => {
  console.log('server started');
});