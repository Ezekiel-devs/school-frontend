import { z } from 'zod';

export const sequenceSchema = z.object({
  name: z.string().min(3, { message: 'The name is required (e.g., First Sequence).' }),
  number: z.string()
    .min(1, { message: "The number is required" })
    .regex(/^[1-6]$/, { message: "The number must be between 1 and 6." }),
});

export type SequenceFormData = z.infer<typeof sequenceSchema>;