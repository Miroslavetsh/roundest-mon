/* eslint-disable @next/next/no-img-element */
import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { inferQueryResponse } from './api/trpc/[trpc]'

const buttonClass =
  'bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow mb-4'

const Home: NextPage = () => {
  const [ids, setIds] = useState<Array<number>>(() => getOptionsForVote())
  const [first, second] = ids

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

  const voteMutation = trpc.useMutation(['cast-vote'])

  const voteForRoundest = (selected: number) => {
    return () => {
      if (selected === first) {
        voteMutation.mutate({ votedForId: first, votedAgainstId: second })
      } else {
        voteMutation.mutate({ votedForId: second, votedAgainstId: first })
      }
      setIds(getOptionsForVote())
    }
  }

  const dataLoaded =
    !firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data

  return (
    <div className='h-screen w-screen flex flex-col justify-between items-center'>
      <div className='text-2xl text-center'>Which Pokemon is Rounder?</div>

      <div className='p-2' />

      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        {dataLoaded && (
          <>
            <PokemonListing pokemon={firstPokemon.data} vote={voteForRoundest(first)} />

            <div className='p-8'>vs</div>

            <PokemonListing pokemon={secondPokemon.data} vote={voteForRoundest(second)} />
          </>
        )}

        {!dataLoaded && (
          <svg
            width='45'
            height='45'
            viewBox='0 0 45 45'
            xmlns='http://www.w3.org/2000/svg'
            stroke='#fff'>
            <g fill='none' fillRule='evenodd' transform='translate(1 1)' strokeWidth='2'>
              <circle cx='22' cy='22' r='6' strokeOpacity='0'>
                <animate
                  attributeName='r'
                  begin='1.5s'
                  dur='3s'
                  values='6;22'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='stroke-opacity'
                  begin='1.5s'
                  dur='3s'
                  values='1;0'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='stroke-width'
                  begin='1.5s'
                  dur='3s'
                  values='2;0'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
              </circle>
              <circle cx='22' cy='22' r='6' strokeOpacity='0'>
                <animate
                  attributeName='r'
                  begin='3s'
                  dur='3s'
                  values='6;22'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='stroke-opacity'
                  begin='3s'
                  dur='3s'
                  values='1;0'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='stroke-width'
                  begin='3s'
                  dur='3s'
                  values='2;0'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
              </circle>
              <circle cx='22' cy='22' r='8'>
                <animate
                  attributeName='r'
                  begin='0s'
                  dur='1.5s'
                  values='6;1;2;3;4;5;6'
                  calcMode='linear'
                  repeatCount='indefinite'
                />
              </circle>
            </g>
          </svg>
        )}
      </div>

      <div className='flex items-center space-x-4 text-sm text-center pb-2'>
        <div className='text-red-700 hover:underline text-xl font-bold'>
          <Link href='/results' passHref>
            Go To Results
          </Link>
        </div>

        <div className='hover:underline'>
          <Link href='https://github.com/Miroslavetsh/roundest-mon' passHref>
            View on Git Hub
          </Link>
        </div>

        <div className='hover:underline'>
          <Link href='https://www.linkedin.com/in/myroslav-toloshnyi-93aba918b/' passHref>
            My LinkedIn
          </Link>
        </div>
      </div>
    </div>
  )
}

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>

const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = (props) => {
  return (
    <div className='h-64 flex flex-col p-4'>
      <Image
        width={256}
        height={256}
        className='max-w-64 max-h-64'
        src={props.pokemon.spriteUrl}
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
