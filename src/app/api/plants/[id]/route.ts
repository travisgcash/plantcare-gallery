import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params

  const { error } = await supabaseServer()
    .from("plants")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
