const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.static('static'));

app.get('/pokemones', (req, res) => {
  async function getPokeInfo(url) {
    const { data } = await axios.get(url);
    return data;
  }

  (async function getPokes() {
    let pokes, html;

    try {
      const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/`);
      pokes = data.data.results;
    } catch (error) {
      if (error.isAxiosError)
        return console.log(
          'Hubo un error del tipo:',
          error.response.statusText
        );
    }

    Promise.all(pokes.map((poke) => getPokeInfo(poke.url)))
      .then((pokesInfo) => {
        pokesInfo.forEach(({ name, weight, height, ...other }) => {
          console.log(other);
          console.log(`${name} => Alto: ${height} - Peso: ${weight}`);
        });
      })
      .catch((error) => {
        console.log(`Hubo un error!!!!!: ${error}`);
      });
  })();
});

app.listen(3000, () => console.log('Servidor andando en el puerto 300'));
