import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PUT /api/questions/[id]/assign-chapter
 *
 * Reassign a question to a different chapter
 *
 * Request body:
 * {
 *   "chapter_id": "uuid-string" | null
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const questionId = params.id;

    // Get request body
    const body = await request.json();
    const { chapter_id } = body;

    // Validate chapter_id is a string or null
    if (chapter_id !== null && typeof chapter_id !== "string") {
      return NextResponse.json(
        { error: "chapter_id must be a string or null" },
        { status: 400 }
      );
    }

    // Update the question's chapter_id
    const { data, error } = await supabase
      .from("questions")
      .update({
        chapter_id: chapter_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", questionId)
      .select()
      .single();

    if (error) {
      console.error("Error updating question chapter:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      question: data,
    });
  } catch (error) {
    console.error("Error in assign-chapter API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
