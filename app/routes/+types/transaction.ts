import type { TransactionRequestSchemaType } from "../../schemas/transaction-request";

export type TransactionClientActionArgs = {
  request: Request;
  params: Record<string, string | undefined>;
};

export type TransactionClientActionData =
  | { result: any; errors?: undefined }
  | { errors: { code: string; message: string }[]; result?: undefined };
