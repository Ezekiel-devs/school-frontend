'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/types/type';

// Définir la structure d'un lien de navigation
interface NavLink {
  href: string;
  label: string;
  // Fonction qui détermine si le lien doit être visible
  isVisible: (role: Role | undefined) => boolean;
}

// Centraliser la définition des liens
const navLinks: NavLink[] = [
  { href: '/home', label: 'Tableau de bord', isVisible: () => true },
  { href: '/students', label: 'Élèves', isVisible: () => true }, // Visible par tous les rôles
  {
    href: '/classes',
    label: 'Classes & Matières',
    isVisible: (role) =>
      role === Role.DIRECTOR || role === Role.ADMIN || role === Role.SUPER_ADMIN,
  },
  {
    href: '/staff',
    label: 'Personnel',
    isVisible: (role) => role === Role.ADMIN || role === Role.SUPER_ADMIN,
  },
  {
    href: '/fees',
    label: 'Finances',
    isVisible: (role) =>
      role === Role.DIRECTOR || role === Role.ADMIN || role === Role.SUPER_ADMIN,
  },
  {
    href: '/reports',
    label: 'Rapports',
    isVisible: (role) =>
      role === Role.DIRECTOR || role === Role.ADMIN || role === Role.SUPER_ADMIN,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/home" className="text-lg font-bold text-primary">
          SchoolApp
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navLinks.map((link) =>
          link.isVisible(userRole) ? (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${
                  // Logique pour déterminer si le lien est actif
                  pathname === link.href || (link.href !== '/home' && pathname.startsWith(link.href))
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
                }`}
            >
              {/* Ici, on pourrait ajouter des icônes plus tard */}
              {link.label}
            </Link>
          ) : null
        )}
      </nav>
    </aside>
  );
}