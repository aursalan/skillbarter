import { verifySession } from '@/lib/sessions'
import { redirect } from 'next/navigation'
import Landing from '@/components/Landing'

export default async function Home() {
  const userId = await verifySession()

  if (userId) {
    redirect('/explore')
  }

  return <Landing />
}
