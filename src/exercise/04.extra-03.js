// Cache resources
// Exercise 4 Extra Credit 3

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// 3. 💯 add cache timeout
// Great, now let’s free up some memory over time. Make the PokemonCacheProvider accept a
// cacheTime prop so it’s configurable (go ahead and set it to 5000). Then figure out a good
// way to clear items in the cache when they’ve been around for longer than the cache time.

// You’ll know you’ve got it right when you can select a pokemon, then go to another one and
// wait for 5 seconds and returning to the first one triggers a refetch (because the pokemon
// is no longer in the cache).

// 🦉 There are several ways to do this. All of them come with trade-offs. Feel free to
// implement it however you like.

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
  
  const PokemonCacheProvider = ({children, cacheTime}) => {
    const cache = React.useRef({})
    const expirations = React.useRef({})
  
    React.useEffect(() => {
      const interval = setInterval(() => {
        for (const [name, time] of Object.entries(expirations.current)) {
          if (time < Date.now()) {
            delete cache.current[name]
          }
        }
      }, 1000)
  
      
  
      return () => clearInterval(interval)
    }, [])
  
    const getPokemonResource = React.useCallback(
      name => {
        const lowerCasePokemon = name.toLowerCase()
        let resource = cache.current[lowerCasePokemon]
        if (!resource) {
          resource = createPokemonResource(lowerCasePokemon)
          cache.current[lowerCasePokemon] = resource
        }
        expirations.current[lowerCasePokemon] = Date.now() + cacheTime
        return resource
      },
      [cacheTime])
  
    return (
      <PokemonResourceCacheContext.Provider value={getPokemonResource}>
        {children}
      </PokemonResourceCacheContext.Provider>
    )
  }
  
  function AppWithProvider() {
    return (
      <PokemonCacheProvider cacheTime={5000}>
        <App />
      </PokemonCacheProvider>
    )
  }
  
  export default AppWithProvider