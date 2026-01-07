import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, content } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create source record
    const { data: source, error: sourceError } = await supabase
      .from("sources")
      .insert({
        project_id: projectId,
        title: title.trim(),
        source_type: "text",
        raw_content: content.trim(),
        status: "ready",
      })
      .select()
      .single();

    if (sourceError) {
      console.error("Error creating source:", sourceError);
      return NextResponse.json(
        { error: "Failed to create source" },
        { status: 500 }
      );
    }

    // TODO: Optionally call analyze endpoint to generate summary
    // This would use Claude AI to analyze the text and extract key concepts

    return NextResponse.json({
      success: true,
      source: {
        id: source.id,
        title: source.title,
        type: source.source_type,
        contentLength: content.trim().length,
      },
    });
  } catch (error) {
    console.error("Error in text source API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
