// Render as you fetch
// Exercise 2 Exrtra Credit 1

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// Extra Credit
// 1. 💯 Suspense and Error Boundary positioning

// You don’t have to wrap the suspending component in a suspense and error boundary directly.
// There can be many layers of nesting and it’ll still work. But there’s some semantically
// important differences that I want you to learn about so go ahead and try to play around
// with wrapping more of your elements in these boundaries and see what changes with the
// user experience.

// 💰 if that’s confusing, this is all we’re talking about:

// <div>
//   <div>Hello there</div>
//   <PokemonErrorBoundary>
//     <React.Suspense fallback={<div>loading</div>}>
//       <SuspendingComponent />
//     </React.Suspense>
//   </PokemonErrorBoundary>
// </div>
// vs this:

// <PokemonErrorBoundary>
//   <React.Suspense fallback={<div>loading</div>}>
//     <div>
//       <div>Hello there</div>
//       <SuspendingComponent />
//     </div>
//   </React.Suspense>
// </PokemonErrorBoundary>

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
      <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
        <div className="pokemon-info">
          {pokemonResource ? (
            <PokemonErrorBoundary
              onReset={handleReset}
              resetKeys={[pokemonResource]}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </PokemonErrorBoundary>
          ) : (
            'Submit a pokemon'
          )}
        </div>
      </React.Suspense>
    </div>
  )
}

export default App
