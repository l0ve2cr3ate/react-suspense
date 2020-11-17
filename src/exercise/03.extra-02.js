// useTransition for improved loading states
// Exercise 1 Extra Credit 2

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// 2. 💯 avoid flash of loading content
// EXPERIMENTAL AND AWKWARD API AHEAD

// Our previous improvement is great. We’re not showing the loading state for 300ms so 
// we’re pretty good. But what if the request takes 350ms? Then we’re right back where 
// we started! The user will see a flash of loading state for 50ms.

// What we really need is a way to say: "Hey React, if this transition takes 300ms, then 
// I want you to keep the transition state around for at least 500ms total no matter what."

// Now, this API is a little strange, it’s not documented (so it’s pretty likely to change). 
// In my testing of it, it was kind of inconsistent, so I think it may be buggy. But to make 
// this happen, you can add the following properties to your SUSPENSE_CONFIG:

// busyDelayMs: Set this to the time of our CSS transition. This is the part that says 
// “if the transition takes X amount of time”
// busyMinDurationMs: Set this to the total time you want the transition state to persist 
// if we surpass the busyDelayMs time.

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
  
  const SUSPENSE_CONFIG = {timeoutMs: 4000, busyDelayMs: 300, busyMinDurationMs: 700}
  
  
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