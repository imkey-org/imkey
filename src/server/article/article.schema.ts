import { Publish } from "@prisma/client";
import { z } from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const paramsAuthor = z.object({
  authorId: z.string(),
});

export const paramsArticleId = z.object({
  articleId: z.string(),
});

export const paramsSlug = z.object({
  slug: z.string(),
});

export const createArticleSchema = z.object({
  params: paramsAuthor,
  body: z.object({
      titleArticle: z.string(),
      contentArticle: jsonSchema,
      thumbnailArticle: jsonSchema,
      categoryId: z.string().array(),
      publish: z.nativeEnum(Publish),
    }),
});

export const updateArticleSchema = z.object({
  params: paramsArticleId,
  body: z.object({
      titleArticle: z.string(),
      contentArticle: jsonSchema,
      thumbnailArticle: jsonSchema.optional(),
      categoryId: z.string().array(),
      publish: z.nativeEnum(Publish),
    })
});

export const updatePublishSchema = z.object({
  params: paramsArticleId,
  body: z.object({
      publish: z.nativeEnum(Publish),
    }),
});

export type ParamsArticleInput = z.infer<typeof paramsArticleId>
export type ParamsAuthorInput = z.infer<typeof paramsAuthor>
export type ParamsSlugInput = z.infer<typeof paramsSlug>
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type UpdatePublishInput = z.infer<typeof updatePublishSchema>
