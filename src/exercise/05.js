// Suspense Image
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource, preloadImage} from '../utils'



// If you turn up the throttle on your network tab (to “Slow 3G” for example) and select 
// pokemon, you may notice that images take a moment to load in.

// For the first one, there’s nothing there and then it bumps the content down when it loads. 
// This can be “fixed” by setting a fixed height for the images. But let’s assume that you 
// can’t be sure what that height is.

// If you select another pokemon, then that pokemon’s data pops in, but the old pokemon’s 
// image remains in place until the new one’s image finishes loading.

// With suspense, we have an opportunity to make this experience a lot better. We have two 
// related options:

// Make an Img component that suspends until the browser has actually loaded the image.
// Make a request for the image alongside the pokemon data.
// Option 1 means that nothing will render until both the data and the image are ready.

// Option 2 is even better because it loads the data and image at the same time. It works 
// because all the images are available via the same information we use to get the pokemon 
// data.

// We’re going to do both of these approaches for this exercise (option 2 is extra credit).

// ❗❗❗❗
// 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// in your DevTools "Network Tab". We're relying on that cache for this
// approach to work!
// ❗❗❗❗


const cache = {}

const Img = ({src, alt, ...props}) => {
  let resource = cache[src]
  if(!resource) {
    resource = createResource(preloadImage(src))
    cache[src] = resource
  }
  return <img src={resource.read()} alt={alt} {...props} />
}


function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <Img src={pokemon.image} alt={pokemon.name} />
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
  return createResource(fetchPokemon(pokemonName))
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


