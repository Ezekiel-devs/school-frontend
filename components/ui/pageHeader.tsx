import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode; // Pour les boutons ou autres actions
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
}