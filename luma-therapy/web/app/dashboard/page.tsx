import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirect if no session (this is already handled by middleware, but good to have as a backup)
  if (!session) {
    redirect('/auth/signin')
  }
  
  // Get user data
  const user = session.user
  
  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}&background=random`
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
        <form action="/auth/signout" method="post">
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <img 
                src={avatarUrl} 
                alt={`${displayName}'s avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/chat">
              <Button className="w-full">Start a new conversation</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 