import { z } from "zod";

const schema = z.object({
  transactionId: z
    .string()
    .min(1, "トランザクションIDは必須です")
    .regex(/^[0-9A-Fa-f]{64}$/, "有効なトランザクションID（ハッシュ）を入力してください"),
  nodeUrl: z
    .string()
    .url()
    .min(1)
    .refine((url) => url.startsWith("http://") || url.startsWith("https://")),
});

export default schema;

export type TransactionRequestSchemaType = z.infer<typeof schema>;
