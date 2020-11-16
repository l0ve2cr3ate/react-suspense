// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js
// Exercise 1 Extra Credit 2

import * as React from 'react'
import {PokemonDataView, fetchPokemon, PokemonErrorBoundary} from '../pokemon'

// 2. 💯 make more generic createResource
// This is also a JavaScript refactor, but in this case we want to make a generic 
// “resource factory” which has the following API:

// const resource = createResource(someAsyncThing())

// function MyComponent() {
//   const myData = resource.read()
//   // render myData stuff
// }
// Try to refactor your code a bit to have a resource factory we can use for all our async needs.


const createResource = (promise) => {
    let status = 'pending'
    let result = promise.then(
      resolved => {
        status = 'success'
        result = resolved
      },
      rejected => {
        status = 'error'
        result = rejected
      },
    )
    return {
      read() {
        if (status === 'pending') throw result
        if (status === 'error') throw result
        if (status === 'success') return result
      },
    }
  }
  
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
          <React.Suspense fallback={<div>Loading...</div>}>
            <PokemonInfo />
          </React.Suspense>
          </PokemonErrorBoundary>
        </div>
      </div>
    )
  }
  
  export default App
  
  