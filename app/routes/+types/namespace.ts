import type { NamespaceRequestSchemaType } from "../../schemas/namespace-request";

export type NamespaceClientActionArgs = {
  request: Request;
  params: Record<string, string | undefined>;
};

export type NamespaceClientActionData =
  | { result: any; errors?: undefined }
  | { errors: { code: string; message: string }[]; result?: undefined };
