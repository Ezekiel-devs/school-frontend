
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  // Le style est défini ici, une bonne fois pour toutes, avec des classes Tailwind.
  // Ces classes (bg-card, text-card-foreground, etc.) fonctionnent grâce à notre config.
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}