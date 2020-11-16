// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js
// Exercise 1 Extra Credit 1

import * as React from 'react'
import {PokemonDataView, fetchPokemon, PokemonErrorBoundary} from '../pokemon'

// Extra Credit
// 1. 💯 add error handling with an Error Boundary

// What happens if you mistype pikachu and instead try to request pikacha? This will result 
// in an error and we need to handle this.

// In React, the way we handle component errors is with an ErrorBoundary.

// 📜 Read up on Error Boundaries if you haven’t used them much before.

// We’ve got an PokemonErrorBoundary component all built-out for you and you can import 
// it from the pokemon file (It’s where we’re getting the PokemonDataView component right 
// now).

// So you’ll wrap your component in an ErrorBoundary for handling that error. But then you 
// need to turn your promise’s error into an error the ErrorBoundary can handle.

// For this extra credit, think of the error as similar to the pokemon data. You’ll need a 
// handler to get access to the error object, and then instead of using it in your JSX, 
// you can simply throw it in your render method:

// function Example() {
//   if (error) {
//     throw error
//   }
//   // ... etc
// }
// Give that a try!

let pokemon
let pokemonError
const pokemonPromise = fetchPokemon('pikacha').then(
  resolvedValue => (pokemon = resolvedValue), error => pokemonError = error
)

function PokemonInfo() {
  if(pokemonError) throw pokemonError
  if (!pokemon) throw pokemonPromise

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
        <React.Suspense fallback={<div>Loading...</div>}>
          <PokemonInfo />
        </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App