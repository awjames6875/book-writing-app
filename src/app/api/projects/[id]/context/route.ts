import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.id;
    const { data: project, error } = await supabase
      .from("projects")
      .select("book_context")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      bookContext: project.book_context || null
    });
  } catch (error) {
    console.error("Error fetching project context:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.id;
    const body = await request.json();
    const { bookContext } = body;

    if (!bookContext) {
      return NextResponse.json(
        { error: "bookContext is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ 
        book_context: bookContext,
        updated_at: new Date().toISOString()
      })
      .eq("id", projectId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bookContext: data.book_context
    });
  } catch (error) {
    console.error("Error updating project context:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
