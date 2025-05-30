import { z } from "zod";

const schema = z.object({
  accountId: z
    .string()
    .min(1, "アカウントIDは必須です")
    .regex(/^[0-9A-Fa-f]{40}$|^[0-9A-Za-z]{39}$/, "有効なアカウントID（公開鍵またはアドレス）を入力してください"),
  nodeUrl: z
    .string()
    .url()
    .min(1)
    .refine((url) => url.startsWith("http://") || url.startsWith("https://")),
});

export default schema;

export type AccountRequestSchemaType = z.infer<typeof schema>;
