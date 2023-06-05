import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "@/server/api/routers/users";
import { articleRouter } from "@/server/api/routers/article";
import { categoryRouter } from "@/server/api/routers/article/category";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: usersRouter,
  article: articleRouter,
  categoryArticle: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
