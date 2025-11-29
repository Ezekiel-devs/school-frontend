import z from "zod";

export const gradeEntrySchema = z.object({
  grades: z.array(z.object({
    studentId: z.string(),
    value: z.string().optional(), // On valide comme une chaîne, on convertira plus tard
  }))
});
export type GradeEntryForm = z.infer<typeof gradeEntrySchema>;