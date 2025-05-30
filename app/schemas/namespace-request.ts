import { z } from "zod";

const schema = z.object({
  namespaceId: z.string().min(1, "ネームスペースIDは必須です"),
  nodeUrl: z
    .string()
    .url()
    .min(1)
    .refine((url) => url.startsWith("http://") || url.startsWith("https://")),
});

export default schema;

export type NamespaceRequestSchemaType = z.infer<typeof schema>;
