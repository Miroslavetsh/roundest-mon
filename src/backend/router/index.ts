import * as trpc from '@trpc/server'
import { z } from 'zod'

import { PokemonClient } from 'pokenode-ts'
import { prisma } from '@/backend/utils/prisma'

export const appRouter = trpc
  .router()
  .query('get-pokemon-by-id', {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const pokemon = await prisma.pokemon.findFirst({ where: { id: input.id } })

      if (!pokemon) throw new Error("Pokemon doesn't exist")
      return { name: pokemon.name, spriteUrl: pokemon.spriteUrl }
    },
  })
  .mutation('cast-vote', {
    input: z.object({ votedForId: z.number(), votedAgainstId: z.number() }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      })
      return { success: true, vote: voteInDb }
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter
