// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {PokemonDataView, fetchPokemon} from '../pokemon'

// In this exercise, we have a page that's specifically for the pokemon named
// Pikachu and we want to load Pikachu's data as soon as the app starts. You're
// going to use an `ErrorBoundary` that I've built for you (as relevant as they are
// to this topic, the concept of `Error Boundaries` long pre-dates Suspense, so we
// won't be getting into it for this workshop). You'll also be using the
// `React.Suspense` API.

let pokemon
const pokemonPromise = fetchPokemon('pikachu').then(
  resolvedValue => (pokemon = resolvedValue),
)

function PokemonInfo() {
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
        <React.Suspense fallback={<div>Loading...</div>}>
          <PokemonInfo />
        </React.Suspense>
      </div>
    </div>
  )
}

export default App


