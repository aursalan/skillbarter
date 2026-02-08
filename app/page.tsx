import { verifySession } from '@/lib/sessions';
import Navbar from "@/components/shared/Navbar";

export default async function Home() {
  const userId = await verifySession();
  const isLoggedIn = !!userId;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar isLoggedIn={isLoggedIn} />
    </div>
  );
}
