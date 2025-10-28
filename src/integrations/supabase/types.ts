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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adas_collaboration_network: {
        Row: {
          "Attribute/Indicator": string | null
          "Engagement Type": string | null
          "Key Suppliers": string | null
          "OEM Name": string | null
          "OEM Product Level Strategy - Build/Buy/Hybrid": string | null
          Parameter: string | null
          Remarks: string | null
          "Sub-attribute": string | null
        }
        Insert: {
          "Attribute/Indicator"?: string | null
          "Engagement Type"?: string | null
          "Key Suppliers"?: string | null
          "OEM Name"?: string | null
          "OEM Product Level Strategy - Build/Buy/Hybrid"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sub-attribute"?: string | null
        }
        Update: {
          "Attribute/Indicator"?: string | null
          "Engagement Type"?: string | null
          "Key Suppliers"?: string | null
          "OEM Name"?: string | null
          "OEM Product Level Strategy - Build/Buy/Hybrid"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sub-attribute"?: string | null
        }
        Relationships: []
      }
      adas_comms_and_positioning_tech: {
        Row: {
          "3D Maps": string | null
          "Dynamic Object Detection": string | null
          "HD Maps": string | null
          "In-Vehicle Data Transfer": string | null
          "OEM Name": string | null
          "Others/Additional info": string | null
          Parameter: string | null
          "Remarks/Others": string | null
          "Road Type Identification": string | null
          "Traffic Light & Sign Recognition": string | null
          "Wireless Communication Network": string | null
        }
        Insert: {
          "3D Maps"?: string | null
          "Dynamic Object Detection"?: string | null
          "HD Maps"?: string | null
          "In-Vehicle Data Transfer"?: string | null
          "OEM Name"?: string | null
          "Others/Additional info"?: string | null
          Parameter?: string | null
          "Remarks/Others"?: string | null
          "Road Type Identification"?: string | null
          "Traffic Light & Sign Recognition"?: string | null
          "Wireless Communication Network"?: string | null
        }
        Update: {
          "3D Maps"?: string | null
          "Dynamic Object Detection"?: string | null
          "HD Maps"?: string | null
          "In-Vehicle Data Transfer"?: string | null
          "OEM Name"?: string | null
          "Others/Additional info"?: string | null
          Parameter?: string | null
          "Remarks/Others"?: string | null
          "Road Type Identification"?: string | null
          "Traffic Light & Sign Recognition"?: string | null
          "Wireless Communication Network"?: string | null
        }
        Relationships: []
      }
      adas_current_snapshot: {
        Row: {
          Attribute: string | null
          Country: string | null
          "OEM Name": string | null
          Parameter: string | null
          Remarks: string | null
          "Road type": string | null
          Unit: string | null
          Value: string | null
        }
        Insert: {
          Attribute?: string | null
          Country?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Road type"?: string | null
          Unit?: string | null
          Value?: string | null
        }
        Update: {
          Attribute?: string | null
          Country?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Road type"?: string | null
          Unit?: string | null
          Value?: string | null
        }
        Relationships: []
      }
      adas_future_blueprint: {
        Row: {
          "AI Integration": string | null
          "AV/ADAS Specific Subsidies": string | null
          "Computing Hardware": string | null
          "Expansion Plans": string | null
          "Hardware Aspiration": string | null
          "Investment Trends in AV/ADAS Projects": string | null
          Location: string | null
          "New Features in the Pipeline": string | null
          "Next-Gen Vehicle Platform": string | null
          "OEM Name": string | null
          "Others (if any)": string | null
          Parameter: string | null
          "R&D Centers": string | null
          Remarks: string | null
          "Sensing and Perception": string | null
          "Software Aspiration": string | null
          "Strategic Initiatives": string | null
          "Strategic Roadmap and Aspiration": string | null
          "Sub-attribute": string | null
          "System Software": string | null
          "Testing Facilities": string | null
          "Upcoming Vehicle Models": string | null
          Value: string | null
        }
        Insert: {
          "AI Integration"?: string | null
          "AV/ADAS Specific Subsidies"?: string | null
          "Computing Hardware"?: string | null
          "Expansion Plans"?: string | null
          "Hardware Aspiration"?: string | null
          "Investment Trends in AV/ADAS Projects"?: string | null
          Location?: string | null
          "New Features in the Pipeline"?: string | null
          "Next-Gen Vehicle Platform"?: string | null
          "OEM Name"?: string | null
          "Others (if any)"?: string | null
          Parameter?: string | null
          "R&D Centers"?: string | null
          Remarks?: string | null
          "Sensing and Perception"?: string | null
          "Software Aspiration"?: string | null
          "Strategic Initiatives"?: string | null
          "Strategic Roadmap and Aspiration"?: string | null
          "Sub-attribute"?: string | null
          "System Software"?: string | null
          "Testing Facilities"?: string | null
          "Upcoming Vehicle Models"?: string | null
          Value?: string | null
        }
        Update: {
          "AI Integration"?: string | null
          "AV/ADAS Specific Subsidies"?: string | null
          "Computing Hardware"?: string | null
          "Expansion Plans"?: string | null
          "Hardware Aspiration"?: string | null
          "Investment Trends in AV/ADAS Projects"?: string | null
          Location?: string | null
          "New Features in the Pipeline"?: string | null
          "Next-Gen Vehicle Platform"?: string | null
          "OEM Name"?: string | null
          "Others (if any)"?: string | null
          Parameter?: string | null
          "R&D Centers"?: string | null
          Remarks?: string | null
          "Sensing and Perception"?: string | null
          "Software Aspiration"?: string | null
          "Strategic Initiatives"?: string | null
          "Strategic Roadmap and Aspiration"?: string | null
          "Sub-attribute"?: string | null
          "System Software"?: string | null
          "Testing Facilities"?: string | null
          "Upcoming Vehicle Models"?: string | null
          Value?: string | null
        }
        Relationships: []
      }
      adas_future_focused_tech: {
        Row: {
          "Advanced Deep Learning Architectures": string | null
          Attribute: string | null
          "Cloud Computing": string | null
          "Computing Hardware Suite": string | null
          "Data Loop Process and Working Mechanism": string | null
          "Edge Computing": string | null
          "LLM Integration": string | null
          "OEM Name": string | null
          Parameter: string | null
          Remarks: string | null
          "Sensing & Perception": string | null
          "Software Stack": string | null
          "Standout AI Features": string | null
        }
        Insert: {
          "Advanced Deep Learning Architectures"?: string | null
          Attribute?: string | null
          "Cloud Computing"?: string | null
          "Computing Hardware Suite"?: string | null
          "Data Loop Process and Working Mechanism"?: string | null
          "Edge Computing"?: string | null
          "LLM Integration"?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sensing & Perception"?: string | null
          "Software Stack"?: string | null
          "Standout AI Features"?: string | null
        }
        Update: {
          "Advanced Deep Learning Architectures"?: string | null
          Attribute?: string | null
          "Cloud Computing"?: string | null
          "Computing Hardware Suite"?: string | null
          "Data Loop Process and Working Mechanism"?: string | null
          "Edge Computing"?: string | null
          "LLM Integration"?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sensing & Perception"?: string | null
          "Software Stack"?: string | null
          "Standout AI Features"?: string | null
        }
        Relationships: []
      }
      adas_onboard_compute_systems: {
        Row: {
          Attribute: string | null
          "OEM Name": string | null
          Parameter: string | null
          Remarks: string | null
          "Sub-attribute": string | null
          Unit: string | null
          Values: string | null
        }
        Insert: {
          Attribute?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sub-attribute"?: string | null
          Unit?: string | null
          Values?: string | null
        }
        Update: {
          Attribute?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          Remarks?: string | null
          "Sub-attribute"?: string | null
          Unit?: string | null
          Values?: string | null
        }
        Relationships: []
      }
      adas_sensing_architecture: {
        Row: {
          "Camera Category": string | null
          "OEM Name": string | null
          Parameter: string | null
          "Parameter Category": string | null
          Position: string | null
          "Sensor Fusion": string | null
          SubParameter: string | null
          Unit: string | null
          Value: string | null
          Zone: string | null
        }
        Insert: {
          "Camera Category"?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          "Parameter Category"?: string | null
          Position?: string | null
          "Sensor Fusion"?: string | null
          SubParameter?: string | null
          Unit?: string | null
          Value?: string | null
          Zone?: string | null
        }
        Update: {
          "Camera Category"?: string | null
          "OEM Name"?: string | null
          Parameter?: string | null
          "Parameter Category"?: string | null
          Position?: string | null
          "Sensor Fusion"?: string | null
          SubParameter?: string | null
          Unit?: string | null
          Value?: string | null
          Zone?: string | null
        }
        Relationships: []
      }
      adas_software: {
        Row: {
          "Cybersecurity Approach": string | null
          "Middleware Platform": string | null
          "OEM Name": string | null
          "OS Compatibility": string | null
          OTA_FOTA: string | null
          OTA_SOTA: string | null
          Parameter: string | null
          "Software Development Approach": string | null
          "Strategic Approach Towards Software platform": string | null
          Value: string | null
        }
        Insert: {
          "Cybersecurity Approach"?: string | null
          "Middleware Platform"?: string | null
          "OEM Name"?: string | null
          "OS Compatibility"?: string | null
          OTA_FOTA?: string | null
          OTA_SOTA?: string | null
          Parameter?: string | null
          "Software Development Approach"?: string | null
          "Strategic Approach Towards Software platform"?: string | null
          Value?: string | null
        }
        Update: {
          "Cybersecurity Approach"?: string | null
          "Middleware Platform"?: string | null
          "OEM Name"?: string | null
          "OS Compatibility"?: string | null
          OTA_FOTA?: string | null
          OTA_SOTA?: string | null
          Parameter?: string | null
          "Software Development Approach"?: string | null
          "Strategic Approach Towards Software platform"?: string | null
          Value?: string | null
        }
        Relationships: []
      }
      csv_data: {
        Row: {
          column_names: string[]
          data: Json
          file_name: string
          id: string
          row_count: number
          uploaded_at: string
        }
        Insert: {
          column_names?: string[]
          data: Json
          file_name: string
          id?: string
          row_count?: number
          uploaded_at?: string
        }
        Update: {
          column_names?: string[]
          data?: Json
          file_name?: string
          id?: string
          row_count?: number
          uploaded_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          metadata: Json | null
          storage_path: string | null
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path?: string
          file_size: number
          file_type: string
          id?: string
          metadata?: Json | null
          storage_path?: string | null
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          metadata?: Json | null
          storage_path?: string | null
          uploaded_at?: string
        }
        Relationships: []
      }
      strategic_insights_feedback: {
        Row: {
          context_info: Json
          created_at: string
          feedback_type: string
          id: string
          insight_hash: string
          insight_text: string
        }
        Insert: {
          context_info?: Json
          created_at?: string
          feedback_type: string
          id?: string
          insight_hash: string
          insight_text: string
        }
        Update: {
          context_info?: Json
          created_at?: string
          feedback_type?: string
          id?: string
          insight_hash?: string
          insight_text?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waypoint_data_context: {
        Row: {
          created_at: string
          data_summary: Json
          id: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_summary: Json
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_summary?: Json
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "viewer" | "analyst"
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
      app_role: ["admin", "viewer", "analyst"],
    },
  },
} as const
