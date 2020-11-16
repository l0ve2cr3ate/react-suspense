// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js
// Exercise 1 Extra Credit 3

import * as React from 'react'
import {PokemonDataView, fetchPokemon, PokemonErrorBoundary, PokemonInfoFallback} from '../pokemon'
import {createResource} from '../utils'

// 3. 💯 Use utils
// There are a few of utilities in the src/utils.js file that we’ll be using a bunch during 
// this workshop. Refactor your code to use createResource from the utils.js and 
// PokemonInfoFallback from the src/pokemon.js file for this one!

const pokemonResource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
  
  const pokemon = pokemonResource.read()

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
        <React.Suspense fallback={<PokemonInfoFallback name="pikachu" />}>
          <PokemonInfo />
        </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App