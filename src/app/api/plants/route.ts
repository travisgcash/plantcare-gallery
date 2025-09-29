import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabaseServer()
    .from("plants")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const out = (data ?? []).map(r => ({
    id: r.id,
    name: r.name,
    imageUrl: r.image_url,
    link: r.link ?? undefined,
    notes: r.notes ?? undefined,
    location: r.location ?? undefined,
    watering: { summer: r.watering_summer ?? "—", winter: r.watering_winter ?? "—" },
    maintenance: { prune: r.maintenance_prune ?? "—", feed: r.maintenance_feed ?? "—" },
    details: {
      size: r.details_size ?? "—",
      sun: r.details_sun ?? "—",
      zone: r.details_zone ?? "—",
      soil: r.details_soil ?? undefined
    },
    createdAt: r.created_at
  }))
  return NextResponse.json(out)
}

export async function POST(req: Request) {
  const b = await req.json()
  if (!b?.name || !b?.imageUrl)
    return NextResponse.json({ error: "name and imageUrl are required" }, { status: 400 })

  const { data, error } = await supabaseServer()
    .from("plants")
    .insert({
      name: b.name,
      image_url: b.imageUrl,
      link: b.link ?? null,
      notes: b.notes ?? null,
      location: b.location ?? null,
      watering_summer: b.watering?.summer ?? null,
      watering_winter: b.watering?.winter ?? null,
      maintenance_prune: b.maintenance?.prune ?? null,
      maintenance_feed: b.maintenance?.feed ?? null,
      details_size: b.details?.size ?? null,
      details_sun: b.details?.sun ?? null,
      details_zone: b.details?.zone ?? null,
      details_soil: b.details?.soil ?? null
    })
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
    watering: { summer: data!.watering_summer ?? "—", winter: data!.watering_winter ?? "—" },
    maintenance: { prune: data!.maintenance_prune ?? "—", feed: data!.maintenance_feed ?? "—" },
    details: {
      size: data!.details_size ?? "—",
      sun: data!.details_sun ?? "—",
      zone: data!.details_zone ?? "—",
      soil: data!.details_soil ?? undefined
    },
    createdAt: data!.created_at
  })
}
