import { z } from "zod";

const MultisigRequestSchema = z.object({
  nodeUrl: z.string().url("有効なURLを入力してください"),
  address: z.string().min(1, "アドレスを入力してください"),
});

export type MultisigRequestSchemaType = z.infer<typeof MultisigRequestSchema>;

export default MultisigRequestSchema;
