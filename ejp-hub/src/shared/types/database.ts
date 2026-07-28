/**
 * Types générés à la main à partir de src/docs/database.sql.
 * À régénérer avec `supabase gen types typescript` une fois le projet lié.
 */

export type UserRole = "admin" | "conducteur";
export type TopicPriority = "haute" | "moyenne" | "basse";
export type TopicStatus = "actif" | "archive";
export type NotificationType = "creneau_a_venir" | "cr_en_attente" | "nouveau_sujet";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
        };
        Update: Partial<{
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
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
      planning_slots: {
        Row: {
          id: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          conducteur_id: string | null;
          prayer_topic_id: string | null;
          location: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          conducteur_id?: string | null;
          prayer_topic_id?: string | null;
          location?: string | null;
          notes?: string | null;
        };
        Update: Partial<{
          slot_date: string;
          start_time: string;
          end_time: string;
          conducteur_id: string | null;
          prayer_topic_id: string | null;
          location: string | null;
          notes: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "planning_slots_conducteur_id_fkey";
            columns: ["conducteur_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planning_slots_prayer_topic_id_fkey";
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
          slot_id: string;
          conducteur_id: string;
          attendees_count: number | null;
          topics_covered: string | null;
          content: string;
          follow_up: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          conducteur_id: string;
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
            foreignKeyName: "reports_slot_id_fkey";
            columns: ["slot_id"];
            isOneToOne: true;
            referencedRelation: "planning_slots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_conducteur_id_fkey";
            columns: ["conducteur_id"];
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
