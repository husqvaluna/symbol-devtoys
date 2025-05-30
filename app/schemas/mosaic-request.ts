import { z } from "zod";

export const mosaicRequestSchema = z.object({
  nodeUrl: z.string().url(),
  mosaicId: z.string().min(1, "Mosaic ID is required"),
});

export type MosaicRequest = z.infer<typeof mosaicRequestSchema>;
