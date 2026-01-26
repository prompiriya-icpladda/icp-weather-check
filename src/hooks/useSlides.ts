import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Slide {
  id: string;
  title: string;
  type: "weather" | "iframe" | "announcement";
  url?: string;
  content?: string;
  duration: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSlides = () => {
  return useQuery({
    queryKey: ["slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Slide[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useAllSlides = () => {
  return useQuery({
    queryKey: ["all-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Slide[];
    },
  });
};

export const useCreateSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slide: Omit<Slide, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("slides")
        .insert(slide)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slides"] });
      queryClient.invalidateQueries({ queryKey: ["all-slides"] });
    },
  });
};

export const useUpdateSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Slide> & { id: string }) => {
      const { data, error } = await supabase
        .from("slides")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slides"] });
      queryClient.invalidateQueries({ queryKey: ["all-slides"] });
    },
  });
};

export const useDeleteSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("slides")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slides"] });
      queryClient.invalidateQueries({ queryKey: ["all-slides"] });
    },
  });
};
