import { z } from "zod";

const schema = z.object({
  identifier: z.number().int().min(1),
  nodeUrl: z
    .string()
    .url()
    .min(1)
    .refine((url) => url.startsWith("http://") || url.startsWith("https://")),
});

export default schema;

export type BlockRequestSchemaType = z.infer<typeof schema>;
