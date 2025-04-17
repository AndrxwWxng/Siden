import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get project data
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Transform to standardized format
    const project = {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      lastActive: data.last_active,
      agents: Array.isArray(data.agents) ? data.agents.length : 0,
      agentIds: Array.isArray(data.agents) ? data.agents : [],
      progress: 0,
      tags: []
    };
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in project API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 