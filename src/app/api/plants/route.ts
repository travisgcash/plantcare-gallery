import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// GET /api/plants → fetch all plants
export async function GET() {
  const { data, error } = await supabaseServer()
    .from("plants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // map DB rows → frontend-friendly shape
  const out = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.image_url,
    link: r.link ?? undefined,
    notes: r.notes ?? undefined,
    location: r.location ?? undefined,
    watering: {
      summer: r.watering_summer ?? "—",
      winter: r.watering_winter ?? "—",
    },
    maintenance: {
      prune: r.maintenance_prune ?? "—",
      feed: r.maintenance_feed ?? "—",
    },
    details: {
      size: r.details_size ?? "—",
      sun: r.details_sun ?? "—",
      zone: r.details_zone ?? "—",
      soil: r.details_soil ?? undefined,
    },
    createdAt: r.created_at,
  }))

  return NextResponse.json(out)
}

// POST /api/plants → add a new plant
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  if (!body?.name || !body?.imageUrl) {
    return NextResponse.json(
      { error: "name and imageUrl are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseServer()
    .from("plants")
    .insert({
      name: body.name,
      image_url: body.imageUrl,
      link: body.link ?? null,
      notes: body.notes ?? null,
      location: body.location ?? null,
      watering_summer: body.watering?.summer ?? null,
      watering_winter: body.watering?.winter ?? null,
      maintenance_prune: body.maintenance?.prune ?? null,
      maintenance_feed: body.maintenance?.feed ?? null,
      details_size: body.details?.size ?? null,
      details_sun: body.details?.sun ?? null,
      details_zone: body.details?.zone ?? null,
      details_soil: body.details?.soil ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // return inserted row in app-friendly shape
  return NextResponse.json({
    id: data!.id,
    name: data!.name,
    imageUrl: data!.image_url,
    link: data!.link ?? undefined,
    notes: data!.notes ?? undefined,
    location: data!.location ?? undefined,
    watering: {
      summer: data!.watering_summer ?? "—",
      winter: data!.watering_winter ?? "—",
    },
    maintenance: {
      prune: data!.maintenance_prune ?? "—",
      feed: data!.maintenance_feed ?? "—",
    },
    details: {
      size: data!.details_size ?? "—",
      sun: data!.details_sun ?? "—",
      zone: data!.details_zone ?? "—",
      soil: data!.details_soil ?? undefined,
    },
    createdAt: data!.created_at,
  })
}