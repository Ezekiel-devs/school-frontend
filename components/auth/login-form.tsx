'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';

import { loginSchema } from '@/schemas/auth';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setLoginError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      setLoginError('Une erreur inattendue est survenue.');
    }
  };

  return (
    <Card className="w-full max-w-md pl-10 pr-10 pt-10 pb-2">
      <h1 className="text-center text-2xl font-bold mb-6 text-primary">
        Connexion Staff
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre.email@ecole.com"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {loginError && (
          <p className="text-sm text-red-500 text-center font-semibold mb-4">{loginError}</p>
        )}

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
      <p className="text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
        Mot de passe oublié ?{' '}
        <Link href="/forgot-password" className="link">
          Réinitialiser
        </Link>
      </p>
    </Card>
  );
}