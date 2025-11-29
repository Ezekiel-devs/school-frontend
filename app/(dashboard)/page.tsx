'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">TMain Dashboard</h1>
      <p>
        Hello, {session?.user?.firstName} {session?.user?.lastName}.
      </p>
      <p>
        You are logged in as : <strong>{session?.user?.role}</strong>.
      </p>
      <p className="mt-4">
        This is the home page of your administration area. You can navigate using the side menu.
      </p>
    </div>
  );
}