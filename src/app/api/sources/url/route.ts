import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper function to extract text content from HTML
function extractTextFromHTML(html: string): string {
  // Remove script and style tags and their content
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ");

  // Clean up whitespace
  text = text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Remove empty lines
    .trim();

  return text;
}

// Helper function to extract title from HTML
function extractTitleFromHTML(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Try to find Open Graph title
  const ogTitleMatch = html.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  );
  if (ogTitleMatch && ogTitleMatch[1]) {
    return ogTitleMatch[1].trim();
  }

  return "Untitled Website";
}

// Helper function to fetch and parse website content
async function fetchWebsiteContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();
    const title = extractTitleFromHTML(html);
    const content = extractTextFromHTML(html);

    return {
      title,
      content,
    };
  } catch (error) {
    console.error("Error fetching website:", error);
    throw new Error("Failed to fetch website content");
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
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      if (!validUrl.protocol.startsWith("http")) {
        throw new Error("URL must use HTTP or HTTPS protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch website content
    const { title, content } = await fetchWebsiteContent(url);

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from the website" },
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
        title: title,
        source_type: "website",
        file_url: url,
        raw_content: content,
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
    // This would use Claude AI to analyze the content and extract key concepts

    return NextResponse.json({
      success: true,
      source: {
        id: source.id,
        title: source.title,
        type: source.source_type,
        url: source.file_url,
        contentLength: content.length,
      },
    });
  } catch (error) {
    console.error("Error in URL source API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
