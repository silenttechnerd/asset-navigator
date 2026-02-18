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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      asset_events: {
        Row: {
          asset_id: string
          company_id: string
          correlation_id: string | null
          created_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          new_value: Json | null
          notes: string | null
          old_value: Json | null
          performed_by_user_id: string | null
          related_assignment_id: string | null
          related_employee_id: string | null
          related_form_request_id: string | null
          related_location_id: string | null
        }
        Insert: {
          asset_id: string
          company_id: string
          correlation_id?: string | null
          created_at?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          performed_by_user_id?: string | null
          related_assignment_id?: string | null
          related_employee_id?: string | null
          related_form_request_id?: string | null
          related_location_id?: string | null
        }
        Update: {
          asset_id?: string
          company_id?: string
          correlation_id?: string | null
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          performed_by_user_id?: string | null
          related_assignment_id?: string | null
          related_employee_id?: string | null
          related_form_request_id?: string | null
          related_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_events_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_related_assignment_id_fkey"
            columns: ["related_assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_related_employee_id_fkey"
            columns: ["related_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_related_form_request_id_fkey"
            columns: ["related_form_request_id"]
            isOneToOne: false
            referencedRelation: "form_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_events_related_location_id_fkey"
            columns: ["related_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          active_assignment_id: string | null
          asset_tag: string
          assigned_to_employee_id: string | null
          attachment_count: number
          carrier: string | null
          category: Database["public"]["Enums"]["asset_category"]
          company_id: string
          condition: Database["public"]["Enums"]["asset_condition"]
          created_at: string | null
          current_location_id: string | null
          home_location_id: string | null
          id: string
          imei1: string | null
          imei2: string | null
          invoice_number: string | null
          last_event_at: string | null
          last_seen_at: string | null
          make: string | null
          mdm_device_id: string | null
          mdm_enrolled: boolean | null
          mdm_provider: string | null
          model: string | null
          notes: string | null
          phone_number: string | null
          purchase_date: string | null
          purchase_price: number | null
          replacement_cost: number | null
          serial_number: string | null
          service_plan_notes: string | null
          specs: Json | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
          vendor_name: string | null
          vendor_order_number: string | null
          warranty_end_date: string | null
        }
        Insert: {
          active_assignment_id?: string | null
          asset_tag: string
          assigned_to_employee_id?: string | null
          attachment_count?: number
          carrier?: string | null
          category: Database["public"]["Enums"]["asset_category"]
          company_id: string
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string | null
          current_location_id?: string | null
          home_location_id?: string | null
          id?: string
          imei1?: string | null
          imei2?: string | null
          invoice_number?: string | null
          last_event_at?: string | null
          last_seen_at?: string | null
          make?: string | null
          mdm_device_id?: string | null
          mdm_enrolled?: boolean | null
          mdm_provider?: string | null
          model?: string | null
          notes?: string | null
          phone_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          replacement_cost?: number | null
          serial_number?: string | null
          service_plan_notes?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          vendor_name?: string | null
          vendor_order_number?: string | null
          warranty_end_date?: string | null
        }
        Update: {
          active_assignment_id?: string | null
          asset_tag?: string
          assigned_to_employee_id?: string | null
          attachment_count?: number
          carrier?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          company_id?: string
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string | null
          current_location_id?: string | null
          home_location_id?: string | null
          id?: string
          imei1?: string | null
          imei2?: string | null
          invoice_number?: string | null
          last_event_at?: string | null
          last_seen_at?: string | null
          make?: string | null
          mdm_device_id?: string | null
          mdm_enrolled?: boolean | null
          mdm_provider?: string | null
          model?: string | null
          notes?: string | null
          phone_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          replacement_cost?: number | null
          serial_number?: string | null
          service_plan_notes?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          vendor_name?: string | null
          vendor_order_number?: string | null
          warranty_end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_to_employee_id_fkey"
            columns: ["assigned_to_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_home_location_id_fkey"
            columns: ["home_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_active_assignment"
            columns: ["active_assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          asset_id: string
          assigned_at: string
          assigned_by_user_id: string | null
          company_id: string
          created_at: string | null
          employee_id: string
          id: string
          issuance_acknowledged_at: string | null
          issuance_signature_pending: boolean
          notes: string | null
          return_acknowledged_at: string | null
          return_condition:
            | Database["public"]["Enums"]["asset_condition"]
            | null
          return_notes: string | null
          return_signature_pending: boolean
          returned_at: string | null
        }
        Insert: {
          asset_id: string
          assigned_at?: string
          assigned_by_user_id?: string | null
          company_id: string
          created_at?: string | null
          employee_id: string
          id?: string
          issuance_acknowledged_at?: string | null
          issuance_signature_pending?: boolean
          notes?: string | null
          return_acknowledged_at?: string | null
          return_condition?:
            | Database["public"]["Enums"]["asset_condition"]
            | null
          return_notes?: string | null
          return_signature_pending?: boolean
          returned_at?: string | null
        }
        Update: {
          asset_id?: string
          assigned_at?: string
          assigned_by_user_id?: string | null
          company_id?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          issuance_acknowledged_at?: string | null
          issuance_signature_pending?: boolean
          notes?: string | null
          return_acknowledged_at?: string | null
          return_condition?:
            | Database["public"]["Enums"]["asset_condition"]
            | null
          return_notes?: string | null
          return_signature_pending?: boolean
          returned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_assigned_by_user_id_fkey"
            columns: ["assigned_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          asset_id: string | null
          company_id: string
          created_at: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          id: string
          label: string | null
          storage_key: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          company_id: string
          created_at?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          label?: string | null
          storage_key: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          company_id?: string
          created_at?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          label?: string | null
          storage_key?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          asset_issuance_policy_text: string | null
          asset_issuance_policy_version: string | null
          asset_tag_prefix: string
          created_at: string
          default_warranty_months: number
          domain: string
          id: string
          name: string
          require_signature_on_issue: boolean
          require_signature_on_return: boolean
          updated_at: string
        }
        Insert: {
          asset_issuance_policy_text?: string | null
          asset_issuance_policy_version?: string | null
          asset_tag_prefix?: string
          created_at?: string
          default_warranty_months?: number
          domain: string
          id?: string
          name: string
          require_signature_on_issue?: boolean
          require_signature_on_return?: boolean
          updated_at?: string
        }
        Update: {
          asset_issuance_policy_text?: string | null
          asset_issuance_policy_version?: string | null
          asset_tag_prefix?: string
          created_at?: string
          default_warranty_months?: number
          domain?: string
          id?: string
          name?: string
          require_signature_on_issue?: boolean
          require_signature_on_return?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      company_memberships: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean
          job_title: string | null
          last_name: string
          location_id: string | null
          notes: string | null
          terminated_at: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_name: string
          location_id?: string | null
          notes?: string | null
          terminated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_name?: string
          location_id?: string | null
          notes?: string | null
          terminated_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_requests: {
        Row: {
          asset_id: string
          assignment_id: string
          company_id: string
          consent_checked: boolean | null
          created_at: string | null
          created_by_user_id: string | null
          email_body: string | null
          email_subject: string | null
          employee_id: string
          expires_at: string
          id: string
          ip_address: string | null
          one_time_use: boolean
          pdf_file_key: string | null
          sent_at: string | null
          signature_file_key: string | null
          signature_type: Database["public"]["Enums"]["signature_type"] | null
          signed_at: string | null
          signing_url_id: string
          snapshots: Json
          status: Database["public"]["Enums"]["form_status"]
          to_email: string
          token_hash: string
          type: Database["public"]["Enums"]["form_type"]
          typed_name: string | null
          updated_at: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          asset_id: string
          assignment_id: string
          company_id: string
          consent_checked?: boolean | null
          created_at?: string | null
          created_by_user_id?: string | null
          email_body?: string | null
          email_subject?: string | null
          employee_id: string
          expires_at: string
          id?: string
          ip_address?: string | null
          one_time_use?: boolean
          pdf_file_key?: string | null
          sent_at?: string | null
          signature_file_key?: string | null
          signature_type?: Database["public"]["Enums"]["signature_type"] | null
          signed_at?: string | null
          signing_url_id?: string
          snapshots?: Json
          status?: Database["public"]["Enums"]["form_status"]
          to_email: string
          token_hash: string
          type: Database["public"]["Enums"]["form_type"]
          typed_name?: string | null
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          asset_id?: string
          assignment_id?: string
          company_id?: string
          consent_checked?: boolean | null
          created_at?: string | null
          created_by_user_id?: string | null
          email_body?: string | null
          email_subject?: string | null
          employee_id?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          one_time_use?: boolean
          pdf_file_key?: string | null
          sent_at?: string | null
          signature_file_key?: string | null
          signature_type?: Database["public"]["Enums"]["signature_type"] | null
          signed_at?: string | null
          signing_url_id?: string
          snapshots?: Json
          status?: Database["public"]["Enums"]["form_status"]
          to_email?: string
          token_hash?: string
          type?: Database["public"]["Enums"]["form_type"]
          typed_name?: string | null
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_requests_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_requests_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          is_system_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_system_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_system_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repairs: {
        Row: {
          asset_id: string
          closed_at: string | null
          company_id: string
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          opened_at: string
          opened_by_user_id: string | null
          ticket_number: string | null
          vendor_name: string | null
        }
        Insert: {
          asset_id: string
          closed_at?: string | null
          company_id: string
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by_user_id?: string | null
          ticket_number?: string | null
          vendor_name?: string | null
        }
        Update: {
          asset_id?: string
          closed_at?: string | null
          company_id?: string
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by_user_id?: string | null
          ticket_number?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_opened_by_user_id_fkey"
            columns: ["opened_by_user_id"]
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
      get_user_role: {
        Args: { _company_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_system_admin: { Args: never; Returns: boolean }
      my_company_ids: { Args: never; Returns: string[] }
      my_role: {
        Args: { cid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      app_role: "system_admin" | "company_admin" | "it_staff" | "read_only"
      asset_category:
        | "Laptop"
        | "Desktop"
        | "Monitor"
        | "Phone"
        | "Tablet"
        | "Printer"
        | "Peripheral"
        | "Network"
        | "Tool"
        | "Other"
      asset_condition: "new" | "good" | "fair" | "poor"
      asset_status:
        | "in_stock"
        | "assigned"
        | "assigned_pending_signature"
        | "in_repair"
        | "lost"
        | "stolen"
        | "retired"
        | "disposed"
      event_type:
        | "created"
        | "updated"
        | "imported"
        | "assigned"
        | "unassigned"
        | "location_changed"
        | "status_changed"
        | "repair_opened"
        | "repair_closed"
        | "attachment_added"
        | "attachment_removed"
        | "note_added"
        | "lost"
        | "found"
        | "stolen"
        | "retired"
        | "disposed"
        | "issue_form_created"
        | "issue_form_sent"
        | "issue_form_viewed"
        | "issue_form_signed"
        | "issue_form_voided"
        | "issue_form_expired"
        | "return_form_created"
        | "return_form_sent"
        | "return_form_viewed"
        | "return_form_signed"
        | "return_form_voided"
        | "return_form_expired"
      form_status: "draft" | "sent" | "viewed" | "signed" | "expired" | "voided"
      form_type: "issuance" | "return"
      signature_type: "drawn" | "typed"
      user_role: "system_admin" | "company_admin" | "it_staff" | "read_only"
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
      app_role: ["system_admin", "company_admin", "it_staff", "read_only"],
      asset_category: [
        "Laptop",
        "Desktop",
        "Monitor",
        "Phone",
        "Tablet",
        "Printer",
        "Peripheral",
        "Network",
        "Tool",
        "Other",
      ],
      asset_condition: ["new", "good", "fair", "poor"],
      asset_status: [
        "in_stock",
        "assigned",
        "assigned_pending_signature",
        "in_repair",
        "lost",
        "stolen",
        "retired",
        "disposed",
      ],
      event_type: [
        "created",
        "updated",
        "imported",
        "assigned",
        "unassigned",
        "location_changed",
        "status_changed",
        "repair_opened",
        "repair_closed",
        "attachment_added",
        "attachment_removed",
        "note_added",
        "lost",
        "found",
        "stolen",
        "retired",
        "disposed",
        "issue_form_created",
        "issue_form_sent",
        "issue_form_viewed",
        "issue_form_signed",
        "issue_form_voided",
        "issue_form_expired",
        "return_form_created",
        "return_form_sent",
        "return_form_viewed",
        "return_form_signed",
        "return_form_voided",
        "return_form_expired",
      ],
      form_status: ["draft", "sent", "viewed", "signed", "expired", "voided"],
      form_type: ["issuance", "return"],
      signature_type: ["drawn", "typed"],
      user_role: ["system_admin", "company_admin", "it_staff", "read_only"],
    },
  },
} as const
