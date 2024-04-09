import { PUBLIC_CDN_URL, PUBLIC_URL } from "$env/static/public";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { and, count, eq } from "drizzle-orm";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "s-maxage=3600, stale-while-revalidate" });

  const query = await db
    .select({
      id: images.id,
      type: images.type,
      name: images.name,
      likes: count(imageLikes.id),
      reports: count(imageReports.id),
    })
    .from(images)
    .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
    .leftJoin(imageReports, eq(images.id, imageReports.imageId))
    .groupBy(images.id)
    .where(and(eq(images.type, params.type.toLowerCase()), eq(images.verified, 1)));

  if (query.length === 0)
    return json({ error: 404, message: `${params.type.toLowerCase()} unsuppoed animal type` });

  return json(
    query.map((i) => ({
      ...i,
      url: `${PUBLIC_URL}/${i.type}/${i.id}`,
      image: `${PUBLIC_CDN_URL}/${i.type}/${i.id}`,
    })),
  );
}
