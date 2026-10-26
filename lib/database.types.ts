export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          locale: "ko" | "en";
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          locale: "ko" | "en";
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          locale?: "ko" | "en";
          email?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_contact: {
        Args: {
          p_locale: string;
          p_email: string;
          p_message: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
