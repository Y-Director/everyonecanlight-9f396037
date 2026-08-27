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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_email: string | null
          category: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event: string
          id: string
          metadata: Json
          notified_emails: string[]
          severity: string
          summary: string | null
          title: string
        }
        Insert: {
          actor_email?: string | null
          category: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event: string
          id?: string
          metadata?: Json
          notified_emails?: string[]
          severity?: string
          summary?: string | null
          title: string
        }
        Update: {
          actor_email?: string | null
          category?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event?: string
          id?: string
          metadata?: Json
          notified_emails?: string[]
          severity?: string
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      admin_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super: boolean
          sections: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_super?: boolean
          sections?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super?: boolean
          sections?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contributor_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      contributor_posts: {
        Row: {
          author_id: string
          blocks: Json
          cover_image_url: string | null
          created_at: string
          id: string
          kind: string
          published_at: string | null
          review_note: string | null
          slug: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          blocks?: Json
          cover_image_url?: string | null
          created_at?: string
          id?: string
          kind?: string
          published_at?: string | null
          review_note?: string | null
          slug?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          blocks?: Json
          cover_image_url?: string | null
          created_at?: string
          id?: string
          kind?: string
          published_at?: string | null
          review_note?: string | null
          slug?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      contributor_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          email: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_purchases: {
        Row: {
          amount: number
          course_name: string
          created_at: string
          currency: string
          email: string
          full_name: string | null
          id: string
          purchased_at: string
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          course_name: string
          created_at?: string
          currency?: string
          email: string
          full_name?: string | null
          id?: string
          purchased_at?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          course_name?: string
          created_at?: string
          currency?: string
          email?: string
          full_name?: string | null
          id?: string
          purchased_at?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          date_added: string
          id: string
          location: string
          manufacturer: string
          name: string
          notes: string | null
          serial_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          date_added?: string
          id?: string
          location?: string
          manufacturer?: string
          name: string
          notes?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date_added?: string
          id?: string
          location?: string
          manufacturer?: string
          name?: string
          notes?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      masterclass_registrations: {
        Row: {
          amount: number
          background: string
          created_at: string
          currency: string
          email: string
          experience: string
          full_name: string
          id: string
          paid_at: string | null
          reference: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          amount: number
          background: string
          created_at?: string
          currency?: string
          email: string
          experience: string
          full_name: string
          id?: string
          paid_at?: string | null
          reference: string
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          amount?: number
          background?: string
          created_at?: string
          currency?: string
          email?: string
          experience?: string
          full_name?: string
          id?: string
          paid_at?: string | null
          reference?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      payment_incidents: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_notified_at: string | null
          details: string | null
          email: string | null
          full_name: string | null
          id: string
          kind: string
          metadata: Json
          provider: string
          reference: string
          reservation_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          customer_notified_at?: string | null
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kind: string
          metadata?: Json
          provider?: string
          reference: string
          reservation_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_notified_at?: string | null
          details?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kind?: string
          metadata?: Json
          provider?: string
          reference?: string
          reservation_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_incidents_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "rental_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      prop_charges: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          prop_ids: string[]
          reference: string
          reservation_id: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          prop_ids?: string[]
          reference: string
          reservation_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          prop_ids?: string[]
          reference?: string
          reservation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "prop_charges_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "rental_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      prop_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          notes: string | null
          price_naira: number
          reservation_id: string | null
          slug: string
          status: string
          unit_label: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          price_naira?: number
          reservation_id?: string | null
          slug: string
          status?: string
          unit_label?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          price_naira?: number
          reservation_id?: string | null
          slug?: string
          status?: string
          unit_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prop_items_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "rental_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_amendments: {
        Row: {
          added_items: Json
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          reference: string
          removed_items: Json
          reservation_id: string
          status: string
          updated_at: string
        }
        Insert: {
          added_items?: Json
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          reference: string
          removed_items?: Json
          reservation_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          added_items?: Json
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          reference?: string
          removed_items?: Json
          reservation_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_amendments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "rental_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_customers: {
        Row: {
          auto_confidence: number | null
          auto_decision: string | null
          created_at: string
          email: string
          email_verified_at: string | null
          full_name: string
          id: string
          id_expiry_date: string | null
          id_extracted: Json
          id_image_path: string | null
          id_type: string | null
          kyc_status: string
          phone: string
          rejection_reason: string | null
          reviewed_at: string | null
          submitted_at: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          auto_confidence?: number | null
          auto_decision?: string | null
          created_at?: string
          email: string
          email_verified_at?: string | null
          full_name: string
          id?: string
          id_expiry_date?: string | null
          id_extracted?: Json
          id_image_path?: string | null
          id_type?: string | null
          kyc_status?: string
          phone: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          submitted_at?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          auto_confidence?: number | null
          auto_decision?: string | null
          created_at?: string
          email?: string
          email_verified_at?: string | null
          full_name?: string
          id?: string
          id_expiry_date?: string | null
          id_extracted?: Json
          id_image_path?: string | null
          id_type?: string | null
          kyc_status?: string
          phone?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          submitted_at?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      rental_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          phone: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          phone?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      rental_reservations: {
        Row: {
          amount_paid: number
          booking_code: string | null
          call_time: string
          checked_out_at: string | null
          confirmation_sent_at: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          customer_id: string | null
          damages_notes: string | null
          damages_recorded: boolean
          days: number
          end_date: string | null
          fulfilment_status: string
          id: string
          items: Json
          job_outcome: string | null
          location: string
          paid_at: string | null
          props: Json
          reference: string
          returned_at: string | null
          runner_id: string | null
          start_date: string | null
          status: string
          subtotal: number
          summary_image_path: string | null
          terms_accepted_at: string | null
          total: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          booking_code?: string | null
          call_time: string
          checked_out_at?: string | null
          confirmation_sent_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          damages_notes?: string | null
          damages_recorded?: boolean
          days?: number
          end_date?: string | null
          fulfilment_status?: string
          id?: string
          items?: Json
          job_outcome?: string | null
          location: string
          paid_at?: string | null
          props?: Json
          reference: string
          returned_at?: string | null
          runner_id?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number
          summary_image_path?: string | null
          terms_accepted_at?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          booking_code?: string | null
          call_time?: string
          checked_out_at?: string | null
          confirmation_sent_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          damages_notes?: string | null
          damages_recorded?: boolean
          days?: number
          end_date?: string | null
          fulfilment_status?: string
          id?: string
          items?: Json
          job_outcome?: string | null
          location?: string
          paid_at?: string | null
          props?: Json
          reference?: string
          returned_at?: string | null
          runner_id?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number
          summary_image_path?: string | null
          terms_accepted_at?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "rental_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_reservations_runner_id_fkey"
            columns: ["runner_id"]
            isOneToOne: false
            referencedRelation: "runners"
            referencedColumns: ["id"]
          },
        ]
      }
      runners: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_joined: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          is_light_operator: boolean
          phone: string
          position: string
          runner_id: string | null
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_joined?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          is_light_operator?: boolean
          phone: string
          position?: string
          runner_id?: string | null
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_joined?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          is_light_operator?: boolean
          phone?: string
          position?: string
          runner_id?: string | null
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_runner_id_fkey"
            columns: ["runner_id"]
            isOneToOne: false
            referencedRelation: "runners"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      prop_items_public: {
        Row: {
          id: string | null
          image_url: string | null
          name: string | null
          price_naira: number | null
          slug: string | null
          status: string | null
          unit_label: string | null
        }
        Insert: {
          id?: string | null
          image_url?: string | null
          name?: string | null
          price_naira?: number | null
          slug?: string | null
          status?: string | null
          unit_label?: string | null
        }
        Update: {
          id?: string | null
          image_url?: string | null
          name?: string | null
          price_naira?: number | null
          slug?: string | null
          status?: string | null
          unit_label?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_post_view: { Args: { _slug: string }; Returns: undefined }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
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

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
