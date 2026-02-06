import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TickerMessage {
  id: string;
  message: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useTickerMessages = () => {
  return useQuery({
    queryKey: ["ticker-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticker_messages")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as TickerMessage[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useAllTickerMessages = () => {
  return useQuery({
    queryKey: ["all-ticker-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticker_messages")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as TickerMessage[];
    },
  });
};

export const useCreateTickerMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Omit<TickerMessage, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("ticker_messages")
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticker-messages"] });
      queryClient.invalidateQueries({ queryKey: ["all-ticker-messages"] });
    },
  });
};

export const useUpdateTickerMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TickerMessage> & { id: string }) => {
      const { data, error } = await supabase
        .from("ticker_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticker-messages"] });
      queryClient.invalidateQueries({ queryKey: ["all-ticker-messages"] });
    },
  });
};

export const useDeleteTickerMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ticker_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticker-messages"] });
      queryClient.invalidateQueries({ queryKey: ["all-ticker-messages"] });
    },
  });
};
