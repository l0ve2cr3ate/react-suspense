// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// In this exercise, we’ll wrap the existing call to set the resource in a transition 
// so the input value gets updated when you select a pokemon. We’ll also make the pokemon 
// information area “appear stale” by making it slightly transparent if isPending is true.

// This is a good one to play around with setting the delay argument to fetchPokemon a bit.

// 📣 BREAKING CHANGE ALERT: The version of React in this project works like it does in the 
// recorded videos. However in the future experimental builds of React, the SUSPENSE_CONFIG 
// option to useTransition has been completely removed. Read more about this here: 
// https://github.com/facebook/react/pull/19703

// Here’s your reminder that you’re learning about experimental software which can change 
// at any moment without notice 😅


function PokemonInfo({pokemonResource}) {
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

const SUSPENSE_CONFIG = {timeoutMs: 4000}


function createPokemonResource(pokemonName) {
  let delay = 1500
  return createResource(fetchPokemon(pokemonName, delay))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }

    startTransition(() => {
      setPokemonResource(createPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App


