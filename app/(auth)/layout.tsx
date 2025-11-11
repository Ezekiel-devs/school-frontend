'use client';

import { useState } from 'react';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <div className="min-h-screen w-full">
      
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
   
  );
}