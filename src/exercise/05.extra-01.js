// Suspense Image
// Exercise 5 Extra Credit 1

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
  getImageUrlForPokemon,
} from '../pokemon'
import {createResource, preloadImage} from '../utils'

// ❗❗❗❗
// 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// in your DevTools "Network Tab". We're relying on that cache for this
// approach to work!
// ❗❗❗❗

// Extra Credit
// 1. 💯 avoid waterfall

// If you open up the network tab, you’ll notice that you have to load the data before 
// you can load the image because the data is where we get the image URL. You may also 
// notice that the image URL is always very predictable. In fact, I even wrote a function 
// for you to get the image URL based on the pokemon name! It’s exported by src/pokemon.js 
// and is called getImageUrlForPokemon.

// const imageUrl = getImageUrlForPokemon('pikachu')
// Try to pre-load this at the same time as the rest of your data. This one will be a bit 
// trickier. I’ll give you a hint. There are several ways you could do this, but in my 
// solution, I end up changing the PokemonInfo component to this:

// function PokemonInfo({pokemonResource}) {
//   const pokemon = pokemonResource.data.read()
//   return (
//     <div>
//       <div className="pokemon-info__img-wrapper">
//         <img src={pokemonResource.image.read()} alt={pokemon.name} />
//       </div>
//       <PokemonDataView pokemon={pokemon} />
//     </div>
//   )
// }



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
  

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

const pokemonResourceCache = {}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (!resource) {
    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }
  return resource
}

function createPokemonResource(pokemonName) {
  const data = createResource(fetchPokemon(pokemonName))
  const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
  return {data, image}
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
      setPokemonResource(getPokemonResource(pokemonName))
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
