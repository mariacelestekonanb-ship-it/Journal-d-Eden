/**
 * Types générés à la main à partir de supabase/migrations/*.sql.
 * À régénérer avec `supabase gen types typescript --local` une fois le
 * projet Supabase lié (voir SUPABASE_SETUP.md).
 */

export type UserRole = "ADMIN" | "PRAYER_LEADER";
export type TopicPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type TopicStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type TopicCategory = "CHURCH" | "FAMILY" | "YOUTH" | "EVANGELISM" | "HEALING" | "NATIONS" | "PERSONAL";
export type NotificationType = "PLANNING" | "REPORT" | "MEMBER" | "PRAYER_TOPIC" | "SYSTEM";
export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type PlanningStatus = "DRAFT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ReportStatus = "DRAFT" | "SUBMITTED" | "VALIDATED" | "REJECTED";
export type MemberStatus = "PENDING" | "ACTIVE" | "REFUSED" | "SUSPENDED";

/** Forme jsonb d'une référence biblique au sein d'une liste (`reports.thanksgiving`, `reports.prayer_points[].references`, …). */
export interface BibleReferenceJson {
  id: string;
  reference: string;
}

/** Forme jsonb d'un point de prière (`reports.prayer_points`). */
export interface PrayerPointJson {
  id: string;
  title: string;
  references: BibleReferenceJson[];
}

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
          status: MemberStatus;
          validated_at: string | null;
          validated_by: string | null;
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
          status?: MemberStatus;
          validated_at?: string | null;
          validated_by?: string | null;
        };
        Update: Partial<{
          firstname: string;
          lastname: string;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          status: MemberStatus;
          validated_at: string | null;
          validated_by: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "profiles_validated_by_fkey";
            columns: ["validated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      prayer_topics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: TopicCategory;
          priority: TopicPriority;
          start_date: string;
          end_date: string | null;
          status: TopicStatus;
          created_by: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category?: TopicCategory;
          priority?: TopicPriority;
          start_date?: string;
          end_date?: string | null;
          status?: TopicStatus;
          created_by: string;
          archived_at?: string | null;
        };
        Update: Partial<{
          title: string;
          description: string | null;
          category: TopicCategory;
          priority: TopicPriority;
          start_date: string;
          end_date: string | null;
          status: TopicStatus;
          archived_at: string | null;
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
          session_date: string;
          session_start_time: string;
          session_end_time: string;
          connected_count: number | null;
          has_instrumental: boolean;
          thanksgiving: BibleReferenceJson[];
          holy_spirit_invitation: BibleReferenceJson[];
          prayer_points: PrayerPointJson[];
          closing_thanksgiving: BibleReferenceJson[];
          announcements: string | null;
          status: ReportStatus;
          created_by: string;
          submitted_at: string | null;
          validated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          planning_id: string;
          prayer_leader_id: string;
          session_date: string;
          session_start_time: string;
          session_end_time: string;
          connected_count?: number | null;
          has_instrumental?: boolean;
          thanksgiving?: BibleReferenceJson[];
          holy_spirit_invitation?: BibleReferenceJson[];
          prayer_points?: PrayerPointJson[];
          closing_thanksgiving?: BibleReferenceJson[];
          announcements?: string | null;
          status?: ReportStatus;
          created_by: string;
          submitted_at?: string | null;
          validated_at?: string | null;
        };
        Update: Partial<{
          session_date: string;
          session_start_time: string;
          session_end_time: string;
          connected_count: number | null;
          has_instrumental: boolean;
          thanksgiving: BibleReferenceJson[];
          holy_spirit_invitation: BibleReferenceJson[];
          prayer_points: PrayerPointJson[];
          closing_thanksgiving: BibleReferenceJson[];
          announcements: string | null;
          status: ReportStatus;
          submitted_at: string | null;
          validated_at: string | null;
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
          {
            foreignKeyName: "reports_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      report_comments: {
        Row: {
          id: string;
          report_id: string;
          author_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          author_id: string;
          message: string;
        };
        Update: Partial<{
          message: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "report_comments_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_comments_author_id_fkey";
            columns: ["author_id"];
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
          priority: NotificationPriority;
          title: string;
          message: string;
          action_url: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          priority?: NotificationPriority;
          title: string;
          message: string;
          action_url?: string | null;
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
