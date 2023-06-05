import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createForgotPasswordSchema, createUserSchema, forgotPasswordSchema, paramsId, updatePasswordSchema, updateRoleSchema, updateUserSchema, verifyForgotPasswordSchema } from "@/server/user/user.schema";
import { createForgotPassword, createUserController, findAllUser, findOneByUserId, removeAccount, resetPassword, updateInfo, updatePassword, updateRole, verifyForgotPassword } from "@/server/user/user.controller";
import { TRPCError } from "@trpc/server";
import { Role } from "@/types/role.enum";
import { paginationQuery } from "@/server/pagination/pagination.schema";

export const usersRouter = createTRPCRouter({
  createUser: protectedProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.BPH) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to create a user",
      });

      return createUserController({ input });
    }),

  findAll: protectedProcedure
    .input(paginationQuery)
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.BPH) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to fetch all users",
      });

      return findAllUser({ query: input });
    }),

  findMe: protectedProcedure
    .query(({ ctx }) => {
      const dataUser = ctx.prisma.user.findUnique({
        select: { name: true, email: true, username: true, role: true, emailVerified: true, isActive: true },
        where: {
          id: ctx.session.user.id,
        },
      });

      return {
        status: "success",
        data: dataUser,
      }
    }),

  findOne: protectedProcedure
    .input(paramsId)
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.BPH) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to fetch a user",
      });

      return findOneByUserId({ params: input });
    }),

  updateInfo: protectedProcedure
    .input(updateUserSchema)
    .mutation(({ ctx, input }) => {
      const userId = (ctx.session.user.role !== Role.BPH) ? ctx.session.user.id : input.params.userId;

      return updateInfo({
        params: { userId },
        updateInput: input.body,
      });
    }),

  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(({ ctx, input }) => {
      const userId = (ctx.session.user.role !== Role.BPH) ? ctx.session.user.id : input.params.userId;

      return updatePassword({
        params: { userId },
        updateInput: input.body,
      });
    }),

  updateRole: protectedProcedure
    .input(updateRoleSchema)
    .mutation(({ ctx, input }) => {
      const userId = (ctx.session.user.role !== Role.BPH) ? ctx.session.user.id : input.params.userId;

      return updateRole({
        params: { userId },
        updateInput: input.body,
      });
    }),

  delete: protectedProcedure
    .input(paramsId)
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.BPH) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete a user",
      });

      return removeAccount({ params: input });
    }),

  forgotPassword: publicProcedure
    .input(createForgotPasswordSchema)
    .mutation(({ input }) => {
      return createForgotPassword({ createForgotInput: input });
    }),

  verifyForgotPassword: publicProcedure
    .input(verifyForgotPasswordSchema)
    .mutation(({ input }) => {
      return verifyForgotPassword({ params: input.params, input: input.body });
    }),

  resetPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(({ input }) => {
      return resetPassword({ params: input.params, input: input.body });
    }),
});
