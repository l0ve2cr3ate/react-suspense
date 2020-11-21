// Suspense with a custom hook
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
  usePokemonResource
} from '../pokemon'


// Extra Credit
// 1. 💯 use the usePokemonResource pre-built hook

// Now that we have a hook for this, we can reuse the usePokemonResource hook anywhere we 
// need to get pokemon info and as long as the user of the hook is rendering a suspense 
// boundary they’ll be able to interact with our hook as if it’s synchronously giving them 
// pokemon information, drastically simplifying their own code (they don’t need to worry 
// about loading or error states).

// We’ve actually already got a usePokemonResource hook in the module ./src/pokemon.js, 
// so swap your own implementation for the one that’s in there and watch the code disappear 😉


function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.data.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, isPending] = usePokemonResource(pokemonName)

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
