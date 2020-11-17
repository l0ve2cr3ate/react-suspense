// Cache resources
// Exercise 4 Extra Credit 2

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// 2. 💯 create a context provider
// Rather than just having an object living forever in memory, let’s put the context in a
// component as a useRef so the object is tied to that component. To do this, we’ll also
// have to move the getPokemonResource function to the component and render it as the value
// to the provider. Don’t forget to memoize it with useCallback so it’s stable between
// re-renders.

// 💰 I call the component you’ll create PokemonCacheProvider.

// 💰 Because the App component needs to consume this value, you’ll need to wrap the App
// component in the PokemonCacheProvider. I do this by making a AppWithProvider component:

// function AppWithProvider() {
//   return (
//     <PokemonCacheProvider>
//       <App />
//     </PokemonCacheProvider>
//   )
// }

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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

const PokemonResourceCacheContext = React.createContext()

const usePokemonResourceCache = () => {
  const context = React.useContext(PokemonResourceCacheContext)
  if (!context) {
    throw new Error(
      'usePokemonResourceCacheContext should be used within a PokemonCacheProvider',
    )
  }
  return context
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const getPokemonResource = usePokemonResourceCache()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition, getPokemonResource])

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

const PokemonCacheProvider = ({children}) => {
  const cache = React.useRef({})

  const getPokemonResource = React.useCallback(
    name => {
      const lowerCasePokemon = name.toLowerCase()
      let resource = cache.current[lowerCasePokemon]
      if (!resource) {
        resource = createPokemonResource(lowerCasePokemon)
        cache.current[lowerCasePokemon] = resource
      }
      return resource
    },
    [cache],
  )
  return (
    <PokemonResourceCacheContext.Provider value={getPokemonResource}>
      {children}
    </PokemonResourceCacheContext.Provider>
  )
}

function AppWithProvider() {
  return (
    <PokemonCacheProvider>
      <App />
    </PokemonCacheProvider>
  )
}

export default AppWithProvider
