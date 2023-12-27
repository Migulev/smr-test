import { z } from 'zod';

export const SmrRowSchema = z.object({
  rowName: z.string().min(1),
  salary: z.number(),
  equipmentCosts: z.number(),
  overheads: z.number(),
  estimatedProfit: z.number(),
});
