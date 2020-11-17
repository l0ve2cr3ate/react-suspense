// Cache resources
// Exercise 4 Extra Credit 1

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// 1. 💯 put cache in context

// Storing a cache as an object in a module is not exactly idiomatic React, but it is an 
// effective mechanism for caching if you don’t care about invalidating the cache. If you 
// want to invalidate the cache in a reliable way, then you’ll want to have access to the 
// React lifecycle.

// In this extra credit, let’s start moving this cache (more specifically the 
// getPokemonResource function) into context and use React.useContext to get the function. 
// This extra credit is simpler than you might think. You can simply pass the 
// getPokemonResource as the defaultValue for your React.createContext call. Then retrieve 
// that function from useContext.

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
  
  const pokemonResourceCache = {}
  
  const getPokemonResource = name => {
    const lowerCasePokemon = name.toLowerCase()
    let resource = pokemonResourceCache[lowerCasePokemon]
    if (!resource) {
      resource = createPokemonResource(lowerCasePokemon)
      pokemonResourceCache[lowerCasePokemon] = resource
    }
    return resource
  }
  
  const PokemonResourceCacheContext = React.createContext(getPokemonResource)
  
  const usePokemonResourceCache = () => {
    return React.useContext(PokemonResourceCacheContext)
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
  
  export default App
  