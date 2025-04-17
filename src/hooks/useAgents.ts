import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'paused';
  project_id: string;
  settings: {
    personality_type?: string;
    tools?: string[];
    permissions?: string[];
  };
  created_at: string;
  updated_at: string;
}

export function useAgents() {
  const params = useParams();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        if (!params?.id) {
          setAgents([]);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('project_id', params.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setAgents(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgents();
  }, [params?.id]);

  return { agents, isLoading, error };
} 