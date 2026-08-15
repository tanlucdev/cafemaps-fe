import { revalidateTag } from "next/cache"

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("Authorization") !== `Bearer ${secret}`) {
    return Response.json({ revalidated: false }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const slug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : null
  const tags = ["cafes", ...(slug ? [`cafe:${slug}`] : [])]

  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }))

  return Response.json({ revalidated: true, tags })
}
