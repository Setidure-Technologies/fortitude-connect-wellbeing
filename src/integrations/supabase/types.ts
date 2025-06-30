export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          message: string
          sender: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message: string
          sender: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message?: string
          sender?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          parent_id: string | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_stats: {
        Row: {
          id: string
          total_donations: number | null
          total_events: number | null
          total_members: number | null
          total_stories: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          total_donations?: number | null
          total_events?: number | null
          total_members?: number | null
          total_stories?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          total_donations?: number | null
          total_events?: number | null
          total_members?: number | null
          total_stories?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      connection_requests: {
        Row: {
          age_range: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          message: string | null
          requester_id: string | null
          target_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          age_range?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          message?: string | null
          requester_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          age_range?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          message?: string | null
          requester_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_responses: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          request_id: string | null
          responder_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          request_id?: string | null
          responder_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          request_id?: string | null
          responder_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connection_responses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "connection_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_responses_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          payment_method: string
          status: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          event_type: string | null
          host_id: string | null
          id: string
          is_online: boolean | null
          location: string | null
          max_attendees: number | null
          meeting_link: string | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          host_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_link?: string | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          host_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_link?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          post_type: Database["public"]["Enums"]["post_type"] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_type?: Database["public"]["Enums"]["post_type"] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_type?: Database["public"]["Enums"]["post_type"] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_entries: {
        Row: {
          content: string | null
          created_at: string | null
          entry_date: string | null
          entry_type: string
          id: string
          mood: Database["public"]["Enums"]["mood_level"] | null
          symptoms: Json | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          entry_type: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_level"] | null
          symptoms?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          entry_type?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_level"] | null
          symptoms?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: string | null
          bio: string | null
          cancer_type: Database["public"]["Enums"]["cancer_type"] | null
          created_at: string | null
          diagnosis_date: string | null
          email: string | null
          full_name: string | null
          id: string
          is_anonymous: boolean | null
          location: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          age_group?: string | null
          bio?: string | null
          cancer_type?: Database["public"]["Enums"]["cancer_type"] | null
          created_at?: string | null
          diagnosis_date?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_anonymous?: boolean | null
          location?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          age_group?: string | null
          bio?: string | null
          cancer_type?: Database["public"]["Enums"]["cancer_type"] | null
          created_at?: string | null
          diagnosis_date?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          location?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          age_group: string | null
          cancer_type: Database["public"]["Enums"]["cancer_type"] | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          is_anonymous: boolean | null
          is_featured: boolean | null
          title: string
          tone: Database["public"]["Enums"]["story_tone"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age_group?: string | null
          cancer_type?: Database["public"]["Enums"]["cancer_type"] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          title: string
          tone?: Database["public"]["Enums"]["story_tone"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age_group?: string | null
          cancer_type?: Database["public"]["Enums"]["cancer_type"] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          title?: string
          tone?: Database["public"]["Enums"]["story_tone"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_reactions: {
        Row: {
          created_at: string | null
          id: string
          reaction_type: string | null
          story_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reaction_type?: string | null
          story_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reaction_type?: string | null
          story_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_reactions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      cancer_type:
        | "breast"
        | "lung"
        | "colon"
        | "blood"
        | "prostate"
        | "skin"
        | "other"
      mood_level: "very_low" | "low" | "neutral" | "good" | "very_good"
      post_type: "question" | "experience" | "support" | "celebration"
      story_tone: "hopeful" | "inspirational" | "raw" | "grief"
      user_role:
        | "patient"
        | "survivor"
        | "caregiver"
        | "volunteer"
        | "admin"
        | "ngo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cancer_type: [
        "breast",
        "lung",
        "colon",
        "blood",
        "prostate",
        "skin",
        "other",
      ],
      mood_level: ["very_low", "low", "neutral", "good", "very_good"],
      post_type: ["question", "experience", "support", "celebration"],
      story_tone: ["hopeful", "inspirational", "raw", "grief"],
      user_role: [
        "patient",
        "survivor",
        "caregiver",
        "volunteer",
        "admin",
        "ngo",
      ],
    },
  },
} as const
