import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private";
import { error } from "@sveltejs/kit";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_AUTH = `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`;

export async function uploadToCloudinary(blob: Blob, publicId: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");
  formData.append("transformation", "c_fill,ar_16:9,g_north");

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    headers: { "Authorization": CLOUDINARY_AUTH },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    console.error(`Cloudinary upload failed: ${message}`);
    error(500, "Failed to upload thumbnail");
  }

  const data = await response.json();
  return data.secure_url as string;
}
