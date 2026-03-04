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
            services: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    price: string | null
                    turnaround_time: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    price?: string | null
                    turnaround_time?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    price?: string | null
                    turnaround_time?: string | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            portfolio: {
                Row: {
                    id: string
                    category: string
                    image_url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    category: string
                    image_url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    category?: string
                    image_url?: string
                    created_at?: string
                }
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    phone: string | null
                    message: string
                    contacted: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone?: string | null
                    message: string
                    contacted?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string | null
                    message?: string
                    contacted?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
