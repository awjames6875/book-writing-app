export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chapter_drafts: {
        Row: {
          chapter_id: string
          content: string
          created_at: string | null
          id: string
          notes: string | null
          version: number
          word_count: number | null
        }
        Insert: {
          chapter_id: string
          content: string
          created_at?: string | null
          id?: string
          notes?: string | null
          version: number
          word_count?: number | null
        }
        Update: {
          chapter_id?: string
          content?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          version?: number
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_drafts_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          current_word_count: number | null
          description: string | null
          id: string
          order_index: number
          project_id: string
          status: Database["public"]["Enums"]["chapter_status"] | null
          target_word_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_word_count?: number | null
          description?: string | null
          id?: string
          order_index: number
          project_id: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          target_word_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_word_count?: number | null
          description?: string | null
          id?: string
          order_index?: number
          project_id?: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          target_word_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          citations: Json | null
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string
        }
        Insert: {
          citations?: Json | null
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id: string
        }
        Update: {
          citations?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          source_ids: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          source_ids?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          source_ids?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          chapter_id: string | null
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string | null
          id: string
          order_index: number | null
          polished_text: string | null
          project_id: string
          question_id: string | null
          raw_text: string
          source_id: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          transcript_id: string | null
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          polished_text?: string | null
          project_id: string
          question_id?: string | null
          raw_text: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          transcript_id?: string | null
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          polished_text?: string | null
          project_id?: string
          question_id?: string | null
          raw_text?: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          transcript_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_transcript_id_fkey"
            columns: ["transcript_id"]
            isOneToOne: false
            referencedRelation: "transcripts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          status: Database["public"]["Enums"]["project_status"] | null
          target_completion_date: string | null
          target_word_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          target_completion_date?: string | null
          target_word_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          target_completion_date?: string | null
          target_word_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_recordings: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          question_id: string
          recording_id: string
          transcript_excerpt: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          question_id: string
          recording_id: string
          transcript_excerpt?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          question_id?: string
          recording_id?: string
          transcript_excerpt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_recordings_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_recordings_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          chapter_id: string | null
          context_notes: string | null
          created_at: string | null
          id: string
          order_index: number
          project_id: string
          source_id: string | null
          status: Database["public"]["Enums"]["question_status"] | null
          text: string
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          context_notes?: string | null
          created_at?: string | null
          id?: string
          order_index: number
          project_id: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["question_status"] | null
          text: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          context_notes?: string | null
          created_at?: string | null
          id?: string
          order_index?: number
          project_id?: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["question_status"] | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      recordings: {
        Row: {
          audio_url: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          project_id: string
          status: Database["public"]["Enums"]["recording_status"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          project_id: string
          status?: Database["public"]["Enums"]["recording_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["recording_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recordings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      source_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          key_concepts: Json | null
          original_url: string | null
          project_id: string
          raw_content: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          status: Database["public"]["Enums"]["source_status"] | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          key_concepts?: Json | null
          original_url?: string | null
          project_id: string
          raw_content?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          status?: Database["public"]["Enums"]["source_status"] | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          key_concepts?: Json | null
          original_url?: string | null
          project_id?: string
          raw_content?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          status?: Database["public"]["Enums"]["source_status"] | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transcripts: {
        Row: {
          created_at: string | null
          id: string
          processed_text: string | null
          raw_text: string
          recording_id: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_text?: string | null
          raw_text: string
          recording_id: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_text?: string | null
          raw_text?: string
          recording_id?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_profiles: {
        Row: {
          created_at: string | null
          frameworks: Json | null
          id: string
          project_id: string
          signature_phrases: Json | null
          style_guide: string | null
          tone_notes: string | null
          updated_at: string | null
          writing_samples: Json | null
        }
        Insert: {
          created_at?: string | null
          frameworks?: Json | null
          id?: string
          project_id: string
          signature_phrases?: Json | null
          style_guide?: string | null
          tone_notes?: string | null
          updated_at?: string | null
          writing_samples?: Json | null
        }
        Update: {
          created_at?: string | null
          frameworks?: Json | null
          id?: string
          project_id?: string
          signature_phrases?: Json | null
          style_guide?: string | null
          tone_notes?: string | null
          updated_at?: string | null
          writing_samples?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_profiles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      chapter_status:
        | "not_started"
        | "in_progress"
        | "ready_to_write"
        | "drafted"
        | "complete"
      content_status: "extracted" | "reviewed" | "approved" | "rejected"
      content_type:
        | "story"
        | "insight"
        | "quote"
        | "framework"
        | "exercise"
        | "other"
      project_status: "draft" | "in_progress" | "review" | "complete"
      question_status: "unanswered" | "partial" | "complete"
      recording_status: "uploading" | "transcribing" | "processed" | "failed"
      source_status: "uploading" | "processing" | "ready" | "failed"
      source_type: "pdf" | "youtube" | "article" | "audio" | "text" | "image"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
