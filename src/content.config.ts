import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const compositions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/compositions' }),
  schema: z.object({
    title: z.string(),
    tier: z.string(),
    author: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    gameplayMode: z.string(),
    coreItems: z.array(z.object({
      name: z.string(),
      description: z.string()
    })),
    augments: z.array(z.object({
      name: z.string(),
      description: z.string(),
      icon: z.string()
    })),
    board: z.object({
      champions: z.array(z.object({
        name: z.string(),
        position: z.object({
          row: z.number(),
          col: z.number()
        }),
        items: z.array(z.string()).optional(),
        stars: z.number().optional()
      }))
    })
  })
});

export const collections = { compositions };