import { ISR_TOKEN } from "$env/static/private";
import { PUBLIC_CDN_URL, PUBLIC_URL } from "$env/static/public";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images, users } from "$lib/server/database/schema.js";
import { error, json } from "@sveltejs/kit";
import { and, count, eq } from "drizzle-orm";

export const config = {
  isr: {
    expiration: 43200,
    bypassToken: ISR_TOKEN,
  },
};

export async function GET({ params }) {
  const [image] = await db
    .select({
      id: images.id,
      name: images.name,
      type: images.type,
      likes: count(imageLikes.id),
      reports: count(imageReports.id),
      createdAt: images.createdAt,
      uploaderUsername: users.username,
    })
    .from(images)
    .where(and(eq(images.verified, 1), eq(images.id, params.id), eq(images.type, params.type)))
    .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
    .leftJoin(imageReports, eq(images.id, imageReports.imageId))
    .leftJoin(users, eq(images.uploadedBy, users.id))
    .groupBy(images.id)
    .limit(1);

  if (!image) return error(404, { message: "Not found" });

  return json({
    ...image,
    url: `${PUBLIC_URL}/${image.type}/${image.id}`,
    image: `${PUBLIC_CDN_URL}/${image.type}/${image.id}`,
  });
}
