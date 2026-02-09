import { verifySession } from '@/lib/sessions'
import LandingPage from './(landing)/LandingPage'
import DashboardPage from './(dashboard)/DashboardPage'

export default async function Home() {
  const userId = await verifySession()

  return userId ? (
    <DashboardPage userId={userId} />
  ) : (
    <LandingPage />
  )
}
