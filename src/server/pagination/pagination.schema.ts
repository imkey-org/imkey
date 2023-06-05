import { z } from "zod";

export const paginationQuery = z.object({
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
  orderColumn: z.string().optional(),
  orderMethod: z.enum(["asc", "desc"]).optional(),
  filter: z.string().optional(),
  status: z.string().optional(),
})

export type PaginationQueryInput = z.TypeOf<typeof paginationQuery>;
