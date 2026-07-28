/**
 * Types générés à la main à partir de supabase/migrations/*.sql.
 * À régénérer avec `supabase gen types typescript --local` une fois le
 * projet Supabase lié (voir SUPABASE_SETUP.md).
 */

export type UserRole = "ADMIN" | "PRAYER_LEADER";
export type TopicPriority = "LOW" | "MEDIUM" | "HIGH";
export type TopicStatus = "ACTIVE" | "ARCHIVED";
export type NotificationType = "UPCOMING_SLOT" | "PENDING_REPORT" | "NEW_TOPIC";
export type PlanningStatus = "DRAFT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          is_active?: boolean;
        };
        Update: Partial<{
          firstname: string;
          lastname: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
        }>;
        Relationships: [];
      };
      prayer_topics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          priority: TopicPriority;
          start_date: string;
          end_date: string | null;
          status: TopicStatus;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          priority?: TopicPriority;
          start_date?: string;
          end_date?: string | null;
          status?: TopicStatus;
          created_by: string;
        };
        Update: Partial<{
          title: string;
          description: string | null;
          priority: TopicPriority;
          start_date: string;
          end_date: string | null;
          status: TopicStatus;
        }>;
        Relationships: [
          {
            foreignKeyName: "prayer_topics_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      planning: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          slot_date: string;
          start_time: string;
          end_time: string;
          location: string | null;
          prayer_leader_id: string | null;
          secondary_leader_id: string | null;
          status: PlanningStatus;
          theme: string | null;
          prayer_topic_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          slot_date: string;
          start_time: string;
          end_time: string;
          location?: string | null;
          prayer_leader_id?: string | null;
          secondary_leader_id?: string | null;
          status?: PlanningStatus;
          theme?: string | null;
          prayer_topic_id?: string | null;
          notes?: string | null;
        };
        Update: Partial<{
          title: string;
          description: string | null;
          slot_date: string;
          start_time: string;
          end_time: string;
          location: string | null;
          prayer_leader_id: string | null;
          secondary_leader_id: string | null;
          status: PlanningStatus;
          theme: string | null;
          prayer_topic_id: string | null;
          notes: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "planning_prayer_leader_id_fkey";
            columns: ["prayer_leader_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planning_secondary_leader_id_fkey";
            columns: ["secondary_leader_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planning_prayer_topic_id_fkey";
            columns: ["prayer_topic_id"];
            isOneToOne: false;
            referencedRelation: "prayer_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          id: string;
          planning_id: string;
          prayer_leader_id: string;
          attendees_count: number | null;
          topics_covered: string | null;
          content: string;
          follow_up: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          planning_id: string;
          prayer_leader_id: string;
          attendees_count?: number | null;
          topics_covered?: string | null;
          content: string;
          follow_up?: string | null;
        };
        Update: Partial<{
          attendees_count: number | null;
          topics_covered: string | null;
          content: string;
          follow_up: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "reports_planning_id_fkey";
            columns: ["planning_id"];
            isOneToOne: true;
            referencedRelation: "planning";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_prayer_leader_id_fkey";
            columns: ["prayer_leader_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonies: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
        };
        Update: Partial<{
          title: string;
          content: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "testimonies_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          link?: string | null;
        };
        Update: Partial<{
          read_at: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
