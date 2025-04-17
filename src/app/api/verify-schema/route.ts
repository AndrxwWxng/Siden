import { NextResponse } from 'next/server';
import { verifySupabaseSchema } from '@/utils/supabase/verify-schema';

export async function GET() {
  try {
    console.log('Starting schema verification from API route');
    
    const result = await verifySupabaseSchema();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in verify-schema API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Schema verification failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 