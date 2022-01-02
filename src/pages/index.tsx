/* eslint-disable @next/next/no-img-element */
import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'

const Home: NextPage = () => {
  const [ids, setIds] = useState<Array<number>>(() => getOptionsForVote())
  const [first, second] = ids

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

  if (firstPokemon.isLoading || secondPokemon.isLoading)
    return <div className='flex-col text-center align-middle'>Loading...</div>

  const voteForRoundest = (selected: number) => {
    return () => {
      // TODO: fire mutation to persist changes
      console.log(selected)
      setIds(getOptionsForVote())
    }
  }

  const buttonClass =
    'bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-4'

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='text-2xl text-center'>Which Pokemon is Rounder?</div>

      <div className='p-2' />

      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        <div className='w-64 h-64 flex flex-col p-4'>
          <img
            className='w-full'
            src={firstPokemon.data?.sprites.front_default || ''}
            alt='first_pokemon'
          />

          <div className='text-center capitalize mt-[-2rem]'>{firstPokemon.data?.name}</div>

          <button onClick={voteForRoundest(first)} className={buttonClass}>
            Rounder
          </button>
        </div>

        <div className='p-8'>vs</div>

        <div className='w-64 h-64 flex flex-col p-4'>
          <img
            className='w-full'
            src={secondPokemon.data?.sprites.front_default || ''}
            alt='second_pokemon'
          />

          <div className='text-center capitalize mt-[-2rem]'>{secondPokemon.data?.name}</div>

          <button onClick={voteForRoundest(second)} className={buttonClass}>
            Rounder
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
