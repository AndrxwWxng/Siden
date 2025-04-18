import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the project ID from the route params
  const id = params.id;
  
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Extract settings from integrations or chat_config if they exist
    const settings = {
      notifications: {
        email: true,
        dailySummary: true,
        activityAlerts: false,
        ...data.integrations?.settings?.notifications
      }
    };
    
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
      tags: [],
      settings: settings
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the project ID from the route params
  const id = params.id;
  
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse update data from request
    const updateData = await request.json();
    
    // Get existing project data to verify ownership
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, user_id, integrations')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Prepare data for update
    // Store settings in integrations column which is already jsonb
    const currentIntegrations = existingProject.integrations || {};
    const dataToUpdate = {
      name: updateData.name,
      description: updateData.description,
      integrations: {
        ...currentIntegrations,
        settings: updateData.settings || {}
      },
      updated_at: new Date().toISOString()
    };
    
    // Update the project
    const { data, error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error in project update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the project ID from the route params
  const id = params.id;
  
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if project exists and belongs to user
    const { data: projectExists, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Database error:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // Delete the project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error in project delete API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 