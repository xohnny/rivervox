import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSiteContent = <T = Record<string, any>>(page: string, section: string, fallback?: T) => {
  const query = useQuery({
    queryKey: ['site-content', page, section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('page', page)
        .eq('section', section)
        .maybeSingle();

      if (error) throw error;
      return (data?.content as T) ?? fallback ?? null;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return {
    content: (query.data ?? fallback) as T,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, section, content }: { page: string; section: string; content: Record<string, any> }) => {
      const { error } = await supabase
        .from('site_content')
        .upsert(
          { page, section, content, updated_at: new Date().toISOString() },
          { onConflict: 'page,section' }
        );
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-content', variables.page, variables.section] });
      toast.success('Content saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save: ' + error.message);
    },
  });
};
