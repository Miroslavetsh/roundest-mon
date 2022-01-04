/* eslint-disable @next/next/no-img-element */
import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import { inferQueryResponse } from './api/trpc/[trpc]'

const buttonClass =
  'bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-4'

const Home: NextPage = () => {
  const [ids, setIds] = useState<Array<number>>(() => getOptionsForVote())
  const [first, second] = ids

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

  const voteMutation = trpc.useMutation(['cast-vote'])

  if (firstPokemon.isLoading || secondPokemon.isLoading)
    return (
      <div className='h-screen w-screen flex flex-col justify-center items-center'>
        <div className='text-2xl text-center'>Which Pokemon is Rounder?</div>

        <div className='p-2' />

        <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
          <div className='flex-col text-center align-middle'>Loading...</div>
        </div>
      </div>
    )

  const voteForRoundest = (selected: number) => {
    return () => {
      if (selected === first) {
        voteMutation.mutate({ votedFor: first, votedAgainst: second })
      } else {
        voteMutation.mutate({ votedFor: second, votedAgainst: first })
      }
      // TODO: fire mutation to persist changes
      console.log(selected)
      setIds(getOptionsForVote())
    }
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='text-2xl text-center'>Which Pokemon is Rounder?</div>

      <div className='p-2' />

      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing pokemon={firstPokemon.data} vote={voteForRoundest(first)} />

              <div className='p-8'>vs</div>

              <PokemonListing pokemon={secondPokemon.data} vote={voteForRoundest(second)} />
            </>
          )}
      </div>
    </div>
  )
}

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>

const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = (props) => {
  return (
    <div className='h-64 flex flex-col p-4'>
      <img
        className='w-64 h-64'
        src={props.pokemon.sprites.front_default || ''}
        alt='first_pokemon'
      />

      <div className='text-center capitalize mt-[-2rem]'>{props.pokemon.name}</div>

      <button onClick={props.vote} className={buttonClass}>
        Rounder
      </button>
    </div>
  )
}

export default Home
