import type { MosaicRequest } from "../../schemas/mosaic-request";

export type MosaicClientActionArgs = {
  request: Request;
  params: Record<string, string | undefined>;
};

export type MosaicClientActionData =
  | { result: any; errors?: undefined }
  | { errors: { code: string; message: string }[]; result?: undefined };
