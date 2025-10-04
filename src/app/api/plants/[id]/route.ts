// src/app/api/plants/[id]/route.ts
import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export const runtime = "nodejs"

// Next 15: params is a Promise
type RouteContext = { params: Promise<{ id: string }> }

// Shape of partial updates coming from the client
type PlantUpdate = {
  name?: string
  imageUrl?: string
  link?: string
  notes?: string
  location?: string
  watering?: { summer?: string; winter?: string }
  maintenance?: { prune?: string; feed?: string }
  details?: { size?: string; sun?: string; zone?: string; soil?: string }
}

// Helper: remove undefined so we only update provided fields
const defined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params

  // Parse body safely without using `any`
  const b = (await req.json().catch(() => ({}))) as PlantUpdate

  // map app shape -> DB columns, include only provided values
  const update = defined({
    name: b.name,
    image_url: b.imageUrl,
    link: b.link,
    notes: b.notes,
    location: b.location,
    watering_summer: b.watering?.summer,
    watering_winter: b.watering?.winter,
    maintenance_prune: b.maintenance?.prune,
    maintenance_feed: b.maintenance?.feed,
    details_size: b.details?.size,
    details_sun: b.details?.sun,
    details_zone: b.details?.zone,
    details_soil: b.details?.soil
  })

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  const { data, error } = await supabaseServer()
    .from("plants")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id: data!.id,
    name: data!.name,
    imageUrl: data!.image_url,
    link: data!.link ?? undefined,
    notes: data!.notes ?? undefined,
    location: data!.location ?? undefined,
    watering: {
      summer: data!.watering_summer ?? "—",
      winter: data!.watering_winter ?? "—"
    },
    maintenance: {
      prune: data!.maintenance_prune ?? "—",
      feed: data!.maintenance_feed ?? "—"
    },
    details: {
      size: data!.details_size ?? "—",
      sun: data!.details_sun ?? "—",
      zone: data!.details_zone ?? "—",
      soil: data!.details_soil ?? undefined
    },
    createdAt: data!.created_at
  })
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params
  const { error } = await supabaseServer().from("plants").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
