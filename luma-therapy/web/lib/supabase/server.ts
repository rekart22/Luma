import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'
import logger from '@/lib/logger'

export interface ClientOptions {
  traceId?: string;
}

export async function createClient(options: ClientOptions = {}) {
  const { traceId } = options;
  
  try {
    logger.debug('Attempting to access cookies', { traceId });
    const cookieStore = await cookies();
    logger.debug('Cookies accessed successfully', { traceId });
    
    return createRouteHandlerClient<Database>({ 
      cookies: () => {
        logger.debug('Supabase auth helper accessing cookie store', { traceId });
        return cookieStore;
      }
    });
  } catch (error) {
    logger.error('Error creating Supabase client', { 
      traceId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
} 