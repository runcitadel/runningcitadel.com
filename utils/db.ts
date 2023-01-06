export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Backups: {
        Row: {
          backup_id: string
          created_at: string | null
          key: string
        }
        Insert: {
          backup_id: string
          created_at?: string | null
          key: string
        }
        Update: {
          backup_id?: string
          created_at?: string | null
          key?: string
        }
      }
      LightningAddresses: {
        Row: {
          address: string | null
          id: number
          provider: Database["public"]["Enums"]["provider"]
          proxyTarget: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["provider"]
          proxyTarget?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["provider"]
          proxyTarget?: string | null
          user_id?: string | null
        }
      }
      logs: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
      }
      reverse_proxies: {
        Row: {
          btcpay_compat: boolean
          created_at: string | null
          host: string
          is_address: boolean | null
          owner: string
          target_url: string
        }
        Insert: {
          btcpay_compat?: boolean
          created_at?: string | null
          host: string
          is_address?: boolean | null
          owner: string
          target_url: string
        }
        Update: {
          btcpay_compat?: boolean
          created_at?: string | null
          host?: string
          is_address?: boolean | null
          owner?: string
          target_url?: string
        }
      }
      subdomains: {
        Row: {
          created_at: string | null
          domain: string
          hashed_secret: string
          username: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          hashed_secret: string
          username: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          hashed_secret?: string
          username?: string
        }
      }
      umbrel_users: {
        Row: {
          id: number
          migrated_at: string | null
        }
        Insert: {
          id?: number
          migrated_at?: string | null
        }
        Update: {
          id?: number
          migrated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_db: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sort_array: {
        Args: { "": unknown }
        Returns: unknown
      }
      unique_backup_uploads: {
        Args: { since: string; until: string }
        Returns: string
      }
      unique_backup_uploads_today: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      provider: "lnme" | "alby" | "otheraddr" | "lnbits" | "bolt12" | "lnurl"
    }
  }
}

