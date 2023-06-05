import { z } from "zod";
import { Role } from "@prisma/client";

const createUser = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email"),
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }).min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
  passwordConfirm: z.string({
    required_error: "Password Confirm is required",
  }),
  role: z.nativeEnum(Role, {
    required_error: "Role is required",
  }).optional(),
});

export const createUserSchema = createUser.refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

export const paramsId = z.object({
  userId: z.string(),
});

export const updateUserSchema = z.object({
  params: paramsId,
  body: createUser.pick({ name: true, username: true }),
});

export const updateRoleSchema = z.object({
  params: paramsId,
  body: createUser.pick({ role: true }),
});

export const updatePasswordSchema = z.object({
  params: paramsId,
  body: z.object({
      oldPassword: z.string({
        required_error: "Password is required",
      }),
      newPassword: z.string({
        required_error: "New password is required",
      }),
    }).refine((data) => data.oldPassword !== data.newPassword, {
      path: ['newPassword'],
      message: 'Passwords do not match',
    })
});

export const paramsVerifyForgotPassword = z.object({
  verification: z.string({
    required_error: "Verification token is required",
  }),
});

export const forgotPasswordSchema = z.object({
  params: paramsVerifyForgotPassword,
  body: z.object({
      email: z.string({
        required_error: "Email is required",
      }).email("Invalid email"),
      password: z.string({
        required_error: "Password is required",
      }),
    }),
});

export const paramsVerifyEmail = z.object({
  verificationEmail: z.string({
    required_error: "Verification token is required",
  }),
});

export const createForgotPasswordSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email"),
  ipRequest: z.string({
    required_error: "IP Request is required",
  }),
  browserRequest: z.string({
    required_error: "Browser Request is required",
  }),
  countryRequest: z.string({
    required_error: "Country Request is required",
  }),
});

export const verifyForgotPasswordSchema = z.object({
  params: paramsVerifyForgotPassword,
  body: z.object({
      ipChanged: z.string({
        required_error: "IP Changed is required",
      }),
      browserChanged: z.string({
        required_error: "Browser Changed is required",
      }),
      countryChanged: z.string({
        required_error: "Country Changed is required",
      }),
    }),
});


export type ParamsInput = z.TypeOf<typeof paramsId>;
export type ParamsVerifyForgotPasswordInput = z.TypeOf<typeof paramsVerifyForgotPassword>;
export type ParamsVerifyEmailInput = z.TypeOf<typeof paramsVerifyEmail>;
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
export type UpdateRoleInput = z.TypeOf<typeof updateRoleSchema>;
export type UpdatePasswordInput = z.TypeOf<typeof updatePasswordSchema>;
export type ForgotPasswordInput = z.TypeOf<typeof forgotPasswordSchema>;
export type CreateForgotPasswordInput = z.TypeOf<typeof createForgotPasswordSchema>;
export type VerifyForgotPasswordInput = z.TypeOf<typeof verifyForgotPasswordSchema>;
