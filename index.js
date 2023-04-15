const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];
const MIN_INSOLATION_FLUX = 0.36;
const MAX_INSOLATION_FLUX = 1.11;
const PLANETARY_RADIUS = 1.6;

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > MIN_INSOLATION_FLUX && planet['koi_insol'] < MAX_INSOLATION_FLUX
    && planet['koi_prad'] < PLANETARY_RADIUS;
}

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true,
  }))
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    const planetNames = habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    })
    console.log(planetNames);
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
