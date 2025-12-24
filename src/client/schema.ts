import z from "zod";

export function createVariablesSchema<DocumentType extends z.ZodObject>(
  documentSchema: DocumentType
) {
  const schema = z.union([z.keyof(documentSchema), z.string()]);

  return z
    .object({
      filterBy: z.array(
        z.object({
          field: schema,
          operator: z.any(),
          value: z.any(),
        })
      ),
      sortBy: z.array(
        z.object({
          field: schema,
          direction: z.enum(["asc", "desc"]),
        })
      ),
    })
    .partial()
    .optional();
}
