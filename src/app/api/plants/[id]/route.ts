import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseServer().from("plants").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
