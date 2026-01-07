import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Helper function to fetch YouTube video info and transcript
async function fetchYouTubeData(videoId: string) {
  try {
    // For now, we'll use a simple approach: fetch the video title from YouTube's oEmbed API
    // In a production environment, you would use the YouTube Data API or a transcript fetching library
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch video information");
    }

    const data = await response.json();

    return {
      title: data.title || "YouTube Video",
      author: data.author_name || "Unknown",
      // Note: YouTube transcript fetching requires additional libraries or APIs
      // For now, we'll use a placeholder
      transcript:
        "YouTube transcript extraction requires additional setup. Please use the YouTube Data API or a third-party transcript service.",
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw new Error("Failed to fetch YouTube video data");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, url } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch YouTube data
    const { title, author, transcript } = await fetchYouTubeData(videoId);

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
        title: title,
        source_type: "youtube",
        file_url: url,
        raw_content: transcript,
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
    // This would use Claude AI to analyze the transcript and extract key concepts

    return NextResponse.json({
      success: true,
      source: {
        id: source.id,
        title: source.title,
        type: source.source_type,
        url: source.file_url,
      },
    });
  } catch (error) {
    console.error("Error in YouTube source API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
