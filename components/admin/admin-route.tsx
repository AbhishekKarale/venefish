'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import { useUser } from 'reactfire';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user } = useUser();
  const { isAdmin, isLoading } = useIsAdmin();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirectTo=/admin/measurements');
        return;
      }
      if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
} 