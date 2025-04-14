
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      municipalities: {
        Row: {
          id: string
          name: string
          state: string
          population: number | null
          budget: number | null
          annual_budget: number | null
          mayor: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          state: string
          population?: number | null
          budget?: number | null
          annual_budget?: number | null
          mayor?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          state?: string
          population?: number | null
          budget?: number | null
          annual_budget?: number | null
          mayor?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      secretariats: {
        Row: {
          id: string
          municipality_id: string
          name: string
          description: string | null
          budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          municipality_id: string
          name: string
          description?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          municipality_id?: string
          name?: string
          description?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string
          cpf: string | null
          birth_date: string | null
          role_id: string
          active: boolean | null
          hire_date: string | null
          first_access: boolean | null
          phone: string | null
          profile_picture_url: string | null
          gdpr_consent_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash: string
          cpf?: string | null
          birth_date?: string | null
          role_id: string
          active?: boolean | null
          hire_date?: string | null
          first_access?: boolean | null
          phone?: string | null
          profile_picture_url?: string | null
          gdpr_consent_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string
          cpf?: string | null
          birth_date?: string | null
          role_id?: string
          active?: boolean | null
          hire_date?: string | null
          first_access?: boolean | null
          phone?: string | null
          profile_picture_url?: string | null
          gdpr_consent_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_secretariats: {
        Row: {
          user_id: string
          secretariat_id: string
          is_primary: boolean | null
          created_at: string
        }
        Insert: {
          user_id: string
          secretariat_id: string
          is_primary?: boolean | null
          created_at?: string
        }
        Update: {
          user_id?: string
          secretariat_id?: string
          is_primary?: boolean | null
          created_at?: string
        }
      }
      funds: {
        Row: {
          id: string
          secretariat_id: string
          name: string
          description: string | null
          annual_budget: number | null
          remaining_budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          secretariat_id: string
          name: string
          description?: string | null
          annual_budget?: number | null
          remaining_budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          secretariat_id?: string
          name?: string
          description?: string | null
          annual_budget?: number | null
          remaining_budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      request_statuses: {
        Row: {
          id: string
          name: string
          description: string | null
          order_sequence: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_sequence: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_sequence?: number
          created_at?: string
        }
      }
      purchase_requests: {
        Row: {
          id: string
          request_number: string
          secretariat_id: string
          fund_id: string
          requester_id: string
          responsible_id: string | null
          description: string
          justification: string
          request_date: string
          total_estimated_value: number
          total_contracted_value: number | null
          status_id: string
          delivery_location: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_number: string
          secretariat_id: string
          fund_id: string
          requester_id: string
          responsible_id?: string | null
          description: string
          justification: string
          request_date: string
          total_estimated_value: number
          total_contracted_value?: number | null
          status_id: string
          delivery_location?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_number?: string
          secretariat_id?: string
          fund_id?: string
          requester_id?: string
          responsible_id?: string | null
          description?: string
          justification?: string
          request_date?: string
          total_estimated_value?: number
          total_contracted_value?: number | null
          status_id?: string
          delivery_location?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      request_items: {
        Row: {
          id: string
          purchase_request_id: string
          name: string
          description: string | null
          quantity: number
          unit_value: number
          total_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          purchase_request_id: string
          name: string
          description?: string | null
          quantity: number
          unit_value: number
          total_value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          purchase_request_id?: string
          name?: string
          description?: string | null
          quantity?: number
          unit_value?: number
          total_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      workflow_steps: {
        Row: {
          id: string
          name: string
          description: string | null
          order_sequence: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_sequence: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_sequence?: number
          created_at?: string
        }
      }
      request_workflows: {
        Row: {
          id: string
          purchase_request_id: string
          workflow_step_id: string
          status: string
          start_date: string | null
          completion_date: string | null
          responsible_id: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          purchase_request_id: string
          workflow_step_id: string
          status: string
          start_date?: string | null
          completion_date?: string | null
          responsible_id?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          purchase_request_id?: string
          workflow_step_id?: string
          status?: string
          start_date?: string | null
          completion_date?: string | null
          responsible_id?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_statuses: {
        Row: {
          id: string
          name: string
          description: string | null
          order_sequence: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_sequence: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_sequence?: number
          created_at?: string
        }
      }
      task_priorities: {
        Row: {
          id: string
          name: string
          description: string | null
          level: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          level: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          level?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          secretariat_id: string
          purchase_request_id: string | null
          status_id: string
          priority_id: string
          assigned_to: string | null
          due_date: string | null
          progress: number | null
          requires_attachment: boolean | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          secretariat_id: string
          purchase_request_id?: string | null
          status_id: string
          priority_id: string
          assigned_to?: string | null
          due_date?: string | null
          progress?: number | null
          requires_attachment?: boolean | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          secretariat_id?: string
          purchase_request_id?: string | null
          status_id?: string
          priority_id?: string
          assigned_to?: string | null
          due_date?: string | null
          progress?: number | null
          requires_attachment?: boolean | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          file_name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string
          created_at?: string
        }
      }
      task_attachments: {
        Row: {
          task_id: string
          attachment_id: string
          created_at: string
        }
        Insert: {
          task_id: string
          attachment_id: string
          created_at?: string
        }
        Update: {
          task_id?: string
          attachment_id?: string
          created_at?: string
        }
      }
      request_attachments: {
        Row: {
          purchase_request_id: string
          attachment_id: string
          created_at: string
        }
        Insert: {
          purchase_request_id: string
          attachment_id: string
          created_at?: string
        }
        Update: {
          purchase_request_id?: string
          attachment_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          notification_type_id: string
          user_id: string
          title: string
          message: string
          entity_type: string | null
          entity_id: string | null
          is_read: boolean | null
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          notification_type_id: string
          user_id: string
          title: string
          message: string
          entity_type?: string | null
          entity_id?: string | null
          is_read?: boolean | null
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          notification_type_id?: string
          user_id?: string
          title?: string
          message?: string
          entity_type?: string | null
          entity_id?: string | null
          is_read?: boolean | null
          created_at?: string
          read_at?: string | null
        }
      }
    }
    Views: {
      vw_purchase_requests: {
        Row: {
          id: string
          request_number: string
          description: string
          justification: string
          request_date: string
          total_estimated_value: number
          total_contracted_value: number | null
          secretariat_id: string
          secretariat_name: string
          fund_id: string
          fund_name: string
          requester_id: string
          requester_name: string
          status_id: string
          status_name: string
          municipality_id: string
          municipality_name: string
          delivery_location: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
      }
      vw_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          secretariat_id: string
          secretariat_name: string
          status_id: string
          status_name: string
          priority_id: string
          priority_name: string
          assigned_to_id: string | null
          assigned_to_name: string | null
          due_date: string | null
          progress: number | null
          requires_attachment: boolean | null
          purchase_request_id: string | null
          request_number: string | null
          municipality_id: string
          municipality_name: string
          created_at: string
          updated_at: string
        }
      }
      vw_request_workflow: {
        Row: {
          id: string
          purchase_request_id: string
          request_number: string
          workflow_step_id: string
          workflow_step_name: string
          order_sequence: number
          status: string
          start_date: string | null
          completion_date: string | null
          responsible_id: string | null
          responsible_name: string | null
          observations: string | null
          secretariat_id: string
          secretariat_name: string
          municipality_id: string
          municipality_name: string
        }
      }
    }
    Functions: {
      [_ in string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [_ in string]: string[]
    }
  }
}
