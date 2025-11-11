import * as React from 'react';
import { cn } from '@/lib/utils'; // On importe notre fonction d'aide pour fusionner les classes

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // Le style est maintenant défini ici avec des classes Tailwind.
        className={cn(
          // Styles de base pour la mise en page et la taille
          'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background',
          // Styles pour la bordure et le texte
          'border-input text-foreground',
          // Styles pour le placeholder
          'placeholder:text-muted-foreground',
          // Styles pour l'état :focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Styles pour l'état :disabled
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Styles spécifiques pour les inputs de type 'file' pour un look propre
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Fusionne avec n'importe quelle classe passée depuis l'extérieur
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };