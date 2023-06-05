import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createArticleController, deleteArticleController, findAllArticle, findOneArticle, findOneSlug, updateArticleController, updatePublishArticleController } from "@/server/article/article.controller";
import { createArticleSchema, paramsArticleId, paramsSlug, updateArticleSchema, updatePublishSchema } from "@/server/article/article.schema";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { Role } from "@/types/role.enum";
import { TRPCError } from "@trpc/server";

export const articleRouter = createTRPCRouter({
  createArticle: protectedProcedure
    .input(createArticleSchema)
    .mutation(({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      return createArticleController({
        params: { authorId },
        input: input.body,
      });
    }),

  updateArticle: protectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input.params.articleId,
        },
        select: {
          author: true,
        }
      });

      if (article?.author !== ctx.session.user.id) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to update this article",
      });

      return updateArticleController({
        paramsId: input.params,
        input: input.body,
      });
    }),

  updatePublishArticle: protectedProcedure
    .input(updatePublishSchema)
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input.params.articleId,
        },
        select: {
          author: true,
        }
      });

      if (article?.author !== ctx.session.user.id && ctx.session.user.role !== Role.BPH) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this article",
        });
      }

      return updatePublishArticleController({
        paramsId: input.params,
        input: input.body,
      });
    }),

  deleteArticle: protectedProcedure
    .input(paramsArticleId)
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input.articleId,
        },
        select: {
          author: true,
        }
      });

      if (article?.author !== ctx.session.user.id && ctx.session.user.role !== Role.BPH) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this article",
        });
      }

      return deleteArticleController({ paramsId: input });
    }),

  getAllSlug: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.article.findMany({
        select: {
          slugArticle: true,
        }
      });
    }),

  getOneArticleBySlug: publicProcedure
    .input(paramsSlug)
    .query(({ input }) => {
      return findOneSlug({ params: input });
    }),

  getOneArticleById: protectedProcedure
    .input(paramsArticleId)
    .query(({ input }) => {
      return findOneArticle({ params: input });
    }),

  getAllArticle: publicProcedure
    .input(paginationQuery)
    .query(({ input }) => {
      return findAllArticle({ query: input });
    })
});
