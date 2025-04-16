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
      activity_history: {
        Row: {
          activity_type_id: string
          created_at: string | null
          description: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          new_value: Json | null
          previous_value: Json | null
          user_id: string
        }
        Insert: {
          activity_type_id: string
          created_at?: string | null
          description: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          user_id: string
        }
        Update: {
          activity_type_id?: string
          created_at?: string | null
          description?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_history_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "activity_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "activity_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
        ]
      }
      activity_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
        ]
      }
      funds: {
        Row: {
          annual_budget: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          remaining_budget: number | null
          secretariat_id: string
          updated_at: string | null
        }
        Insert: {
          annual_budget?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          remaining_budget?: number | null
          secretariat_id: string
          updated_at?: string | null
        }
        Update: {
          annual_budget?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          remaining_budget?: number | null
          secretariat_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funds_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "secretariats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funds_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "funds_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["secretariat_id"]
          },
        ]
      }
      municipalities: {
        Row: {
          annual_budget: number | null
          budget: number | null
          created_at: string | null
          id: string
          logo_url: string | null
          mayor: string | null
          name: string
          population: number | null
          state: string
          updated_at: string | null
        }
        Insert: {
          annual_budget?: number | null
          budget?: number | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          mayor?: string | null
          name: string
          population?: number | null
          state: string
          updated_at?: string | null
        }
        Update: {
          annual_budget?: number | null
          budget?: number | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          mayor?: string | null
          name?: string
          population?: number | null
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type_id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type_id: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type_id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_notification_type_id_fkey"
            columns: ["notification_type_id"]
            isOneToOne: false
            referencedRelation: "notification_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          created_at: string | null
          delivery_location: string | null
          description: string
          fund_id: string
          id: string
          justification: string
          observations: string | null
          request_date: string
          request_number: string
          requester_id: string
          responsible_id: string | null
          secretariat_id: string
          status_id: string
          total_contracted_value: number | null
          total_estimated_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_location?: string | null
          description: string
          fund_id: string
          id?: string
          justification: string
          observations?: string | null
          request_date: string
          request_number: string
          requester_id: string
          responsible_id?: string | null
          secretariat_id: string
          status_id: string
          total_contracted_value?: number | null
          total_estimated_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_location?: string | null
          description?: string
          fund_id?: string
          id?: string
          justification?: string
          observations?: string | null
          request_date?: string
          request_number?: string
          requester_id?: string
          responsible_id?: string | null
          secretariat_id?: string
          status_id?: string
          total_contracted_value?: number | null
          total_estimated_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["fund_id"]
          },
          {
            foreignKeyName: "purchase_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "purchase_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "purchase_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
          {
            foreignKeyName: "purchase_requests_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "purchase_requests_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "purchase_requests_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "secretariats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "purchase_requests_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "request_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["status_id"]
          },
        ]
      }
      request_attachments: {
        Row: {
          attachment_id: string
          created_at: string | null
          purchase_request_id: string
        }
        Insert: {
          attachment_id: string
          created_at?: string | null
          purchase_request_id: string
        }
        Update: {
          attachment_id?: string
          created_at?: string | null
          purchase_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_attachments_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_attachments_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_attachments_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_attachments_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "request_attachments_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["purchase_request_id"]
          },
        ]
      }
      request_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          purchase_request_id: string
          quantity: number
          total_value: number | null
          unit_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          purchase_request_id: string
          quantity: number
          total_value?: number | null
          unit_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          purchase_request_id?: string
          quantity?: number
          total_value?: number | null
          unit_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_items_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_items_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_items_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "request_items_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["purchase_request_id"]
          },
        ]
      }
      request_statuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_sequence: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_sequence: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_sequence?: number
        }
        Relationships: []
      }
      request_workflows: {
        Row: {
          completion_date: string | null
          created_at: string | null
          id: string
          observations: string | null
          purchase_request_id: string
          responsible_id: string | null
          start_date: string | null
          status: string
          updated_at: string | null
          workflow_step_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          id?: string
          observations?: string | null
          purchase_request_id: string
          responsible_id?: string | null
          start_date?: string | null
          status: string
          updated_at?: string | null
          workflow_step_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          id?: string
          observations?: string | null
          purchase_request_id?: string
          responsible_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          workflow_step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_workflows_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_workflows_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_workflows_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "request_workflows_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "request_workflows_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_workflows_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "request_workflows_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "request_workflows_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
          {
            foreignKeyName: "request_workflows_workflow_step_id_fkey"
            columns: ["workflow_step_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["workflow_step_id"]
          },
          {
            foreignKeyName: "request_workflows_workflow_step_id_fkey"
            columns: ["workflow_step_id"]
            isOneToOne: false
            referencedRelation: "workflow_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      secretariats: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          id: string
          municipality_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          municipality_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          municipality_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secretariats_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secretariats_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["municipality_id"]
          },
          {
            foreignKeyName: "secretariats_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["municipality_id"]
          },
          {
            foreignKeyName: "secretariats_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["municipality_id"]
          },
        ]
      }
      task_attachments: {
        Row: {
          attachment_id: string
          created_at: string | null
          task_id: string
        }
        Insert: {
          attachment_id: string
          created_at?: string | null
          task_id: string
        }
        Update: {
          attachment_id?: string
          created_at?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_priorities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      task_statuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_sequence: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_sequence: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_sequence?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority_id: string
          progress: number | null
          purchase_request_id: string | null
          requires_attachment: boolean | null
          secretariat_id: string
          status_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority_id: string
          progress?: number | null
          purchase_request_id?: string | null
          requires_attachment?: boolean | null
          secretariat_id: string
          status_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority_id?: string
          progress?: number | null
          purchase_request_id?: string | null
          requires_attachment?: boolean | null
          secretariat_id?: string
          status_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
          {
            foreignKeyName: "tasks_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "task_priorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["priority_id"]
          },
          {
            foreignKeyName: "tasks_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "tasks_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["purchase_request_id"]
          },
          {
            foreignKeyName: "tasks_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "secretariats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "tasks_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "task_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["status_id"]
          },
        ]
      }
      user_secretariats: {
        Row: {
          created_at: string | null
          is_primary: boolean | null
          secretariat_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_primary?: boolean | null
          secretariat_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_primary?: boolean | null
          secretariat_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_secretariats_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "secretariats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_secretariats_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "user_secretariats_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "user_secretariats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_secretariats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["requester_id"]
          },
          {
            foreignKeyName: "user_secretariats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_request_workflow"
            referencedColumns: ["responsible_id"]
          },
          {
            foreignKeyName: "user_secretariats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["assigned_to_id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          email: string
          first_access: boolean | null
          gdpr_consent_date: string | null
          hire_date: string | null
          id: string
          name: string
          password_hash: string
          phone: string | null
          profile_picture_url: string | null
          role_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          first_access?: boolean | null
          gdpr_consent_date?: string | null
          hire_date?: string | null
          id?: string
          name: string
          password_hash: string
          phone?: string | null
          profile_picture_url?: string | null
          role_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          first_access?: boolean | null
          gdpr_consent_date?: string | null
          hire_date?: string | null
          id?: string
          name?: string
          password_hash?: string
          phone?: string | null
          profile_picture_url?: string | null
          role_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_sequence: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_sequence: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_sequence?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_purchase_requests: {
        Row: {
          created_at: string | null
          delivery_location: string | null
          description: string | null
          fund_id: string | null
          fund_name: string | null
          id: string | null
          justification: string | null
          municipality_id: string | null
          municipality_name: string | null
          observations: string | null
          request_date: string | null
          request_number: string | null
          requester_id: string | null
          requester_name: string | null
          secretariat_id: string | null
          secretariat_name: string | null
          status_id: string | null
          status_name: string | null
          total_contracted_value: number | null
          total_estimated_value: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      vw_request_workflow: {
        Row: {
          completion_date: string | null
          id: string | null
          municipality_id: string | null
          municipality_name: string | null
          observations: string | null
          order_sequence: number | null
          purchase_request_id: string | null
          request_number: string | null
          responsible_id: string | null
          responsible_name: string | null
          secretariat_id: string | null
          secretariat_name: string | null
          start_date: string | null
          status: string | null
          workflow_step_id: string | null
          workflow_step_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "secretariats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_purchase_requests"
            referencedColumns: ["secretariat_id"]
          },
          {
            foreignKeyName: "purchase_requests_secretariat_id_fkey"
            columns: ["secretariat_id"]
            isOneToOne: false
            referencedRelation: "vw_tasks"
            referencedColumns: ["secretariat_id"]
          },
        ]
      }
      vw_tasks: {
        Row: {
          assigned_to_id: string | null
          assigned_to_name: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string | null
          municipality_id: string | null
          municipality_name: string | null
          priority_id: string | null
          priority_name: string | null
          progress: number | null
          purchase_request_id: string | null
          request_number: string | null
          requires_attachment: boolean | null
          secretariat_id: string | null
          secretariat_name: string | null
          status_id: string | null
          status_name: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
