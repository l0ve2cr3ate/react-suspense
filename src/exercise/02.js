// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// In this one, we now have a form that allows us to choose a pokemon by any name.
// As soon as the user hits "submit", we pass the `pokemonName` to our
// `PokemonInfo` component which makes the request to get the pokemon data (using
// `useEffect`).

// For the exercise, you need to refactor this from `useEffect` to Suspense. You'll
// need to add the `ErrorBoundary` and `Suspense` components to the `PokemonInfo`
// component, and you'll pass the pokemon resource to `PokemonInfoView` which will
// call `.read()` on the resource. The initial `.read()` call will trigger the
// component to suspend and display the fallback state. When the promise resolves,
// React will re-render our components and we'll be able to display the pokemon.

// > The real important parts of the render-as-you-fetch approach comes in the
// > extra credit, but changing things to this will help a lot to get us going.

// 🐨 Your goal is to refactor this traditional useEffect-style async
// interaction to suspense with resources. Enjoy!

const createPokemonResource = pokemonName =>
  createResource(fetchPokemon(pokemonName))

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

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    setPokemonResource(createPokemonResource(pokemonName))
  }, [pokemonName])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const handleReset = () => setPokemonName('')

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
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

