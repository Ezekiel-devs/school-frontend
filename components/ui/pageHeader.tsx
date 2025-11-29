import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Une icône sympa pour le retour

interface PageHeaderProps {
  title: string;
  backLink?: string;
  backLinkLabel?: string;
  children?: React.ReactNode; // Pour les boutons d'action
}

export function PageHeader({
  title,
  backLink,
  backLinkLabel = 'Retour',
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backLink && (
          <Link href={backLink} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            {backLinkLabel}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      
      {/* Cet espace contiendra le bouton "Ajouter un élève" par exemple */}
      <div>{children}</div>
    </div>
  );
}