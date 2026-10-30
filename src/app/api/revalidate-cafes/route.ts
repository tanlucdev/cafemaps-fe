import { revalidateTag } from "next/cache"

function reject(status: number) {
  console.warn(JSON.stringify({ type: "cafe.revalidate.rejected", status }))
  return Response.json({ revalidated: false }, { status })
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("Authorization") !== `Bearer ${secret}`) {
    return reject(401)
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== "object" || Array.isArray(body)) return reject(400)
  let slug: string | null = null
  if ("slug" in body) {
    if (typeof body.slug !== "string" || !body.slug.trim()) return reject(400)
    slug = body.slug.trim()
    if (`cafe:${slug}`.length > 256) return reject(400)
  }
  const tags = ["cafes", ...(slug ? [`cafe:${slug}`] : [])]

  try {
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }))
  } catch {
    return reject(500)
  }
  console.info(JSON.stringify({ type: "cafe.revalidate.done", status: 200, slug, tags }))

  return Response.json({ revalidated: true, tags })
}
