import * as React from 'react';
import { cn } from '@/lib/utils'; // On garde `cn` pour fusionner les classes intelligemment

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      // On applique directement les classes de base de Tailwind ici
      // et on les fusionne avec toute `className` externe grâce à `cn`.
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };