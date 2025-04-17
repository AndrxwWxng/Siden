import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/utils/supabase/test-connection';

export async function GET() {
  try {
    const result = await testSupabaseConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Connection test failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 