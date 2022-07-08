import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';
import axios from 'axios';

const API_URL_TESB = 'https://swapi.dev/api/films/2/';

const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [filmTESB, setTESB] = useState();

  useEffect(() => {
    axios
      .get(API_URL_TESB)
      .then(resTESB => {
        const promises = [];
        resTESB.data.species.forEach(item => {
          promises.push(axios.get(item));
        });
        return Promise.all(promises);
      })
      .then(data => {
        setTESB(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const heightCalculator = height => {
    var heightInches;
    if (isNaN(parseInt(height))) {
      heightInches = 'N/A';
    } else {
      heightInches = parseInt(height) / CM_TO_IN_CONVERSION_RATIO;
      return `${Math.round(heightInches)}"`;
    }
    return heightInches;
  };

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {filmTESB &&
          filmTESB.map((specie, index) => (
            <Species
              key={index}
              name={specie.data.name}
              classification={specie.data.classification}
              designation={specie.data.designation}
              height={heightCalculator(specie.data.average_height)}
              image={
                SPECIES_IMAGES[specie.data.name.split("'")[0].toLowerCase()]
              }
              numFilms={specie.data.films.length}
              language={specie.data.language}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
