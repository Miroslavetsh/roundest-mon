import { GetServerSideProps, NextPage } from 'next'

import { prisma } from '@/backend/utils/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import Image from 'next/image'

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

interface ResultsPropTypes {
  pokemon: PokemonQueryResult
}

const generateCountPercent = (pokemon: PokemonQueryResult[number]): number => {
  const { VoteFor, VoteAgainst } = pokemon._count

  if (VoteFor + VoteAgainst === 0) return 0
  return (VoteFor / (VoteFor + VoteAgainst)) * 100
}

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({ pokemon }) => {
  return (
    <div className='flex border p-4 w-full justify-between items-center odd:bg-gray-700'>
      <div className='flex items-center'>
        <Image
          width={32}
          height={32}
          className='max-w-64 max-h-64'
          src={pokemon.spriteUrl}
          alt='pokemon'
        />

        <div className='capitalize'>{pokemon.name}</div>
      </div>

      <div>{generateCountPercent(pokemon)}%</div>
    </div>
  )
}

const Results: NextPage<ResultsPropTypes> = (props) => {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='p-4 text-2xl text-center'>Results</h2>

      <div className='max-w-2xl w-full'>
        {props.pokemon.map((currentPokemon) => {
          return <PokemonListing pokemon={currentPokemon} key={currentPokemon.id} />
        })}
      </div>
    </div>
  )
}

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: 'desc' },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  })
}

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder()
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 }
}

export default Results
