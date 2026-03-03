import { supabase } from "./supabase";

const BUCKET_NAME = "sweetemballage";

/**
 * Given a filename or path stored in the DB, reconstructs the full public Supabase URL.
 * If the path is already a full URL (starts with http), it returns it as is.
 */
export function getProductImageUrl(path: string | null): string {
  if (!path || path === "null" || path === "")
    return "/placeholder-product.png";

  if (path.startsWith("http")) return path;

  // Handle local placeholders if any still remain
  if (path.startsWith("/productimages/")) return path;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}
