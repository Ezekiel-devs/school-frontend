// src/types/index.d.ts

// Enums (basés sur votre schema.prisma)
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Role {
  TEACHER = 'TEACHER',
  CLASS_COORDINATOR = 'CLASS_COORDINATOR',
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum Section {
  ANGLOPHONE = 'ANGLOPHONE',
  FRANCOPHONE = 'FRANCOPHONE',
}

export enum Mode {
  CASH = 'CASH',
  MOMO = 'MOMO',
  OM = 'OM',
  BANK = 'BANK',
}

// Modèles (simplifiés pour l'exemple)
export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  birthdate: string; // Ou Date
  phoneParent?: string;
  gender: Gender;
  createdAt: string; // Ou Date
  updatedAt: string; // Ou Date
  // Ajoutez d'autres relations si nécessaires pour l'affichage
}

export interface Classroom {
  id: string;
  name: string;
  section: Section;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  label: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credit: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  birthdate: string;
  gender: Gender;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  yearId: string;
  student?: Student; // Optionnel si chargé avec la relation
  classroom?: Classroom;
  year?: AcademicYear;
  createdAt: string;
  updatedAt: string;
}

export interface Sequence {
  id: string;
  name: string;
  number: number;
  yearId: string;
  year?: AcademicYear; // Optionnel si chargé avec la relation
  createdAt: string;
  updatedAt: string;
}

export interface Teach {
  id: string;
  classId: string;
  subjectId: string;
  staffId: string;
  academicYearId: string;
  classroom?: Classroom;   // Relations optionnelles
  subject?: Subject;
  staff?: Staff;
  academicYear?: AcademicYear;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  value: number; // Prisma utilise Decimal, mais `number` est plus courant en JS/TS
  studentId: string;
  subjectId: string;
  staffId: string;
  sequenceId: string;
  student?: Student;     // Relations optionnelles
  subject?: Subject;
  staff?: Staff;
  sequence?: Sequence;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFee {
  id: string;
  total: number;       // Decimal -> number
  remaining: number;   // Decimal -> number
  description: string;
  studentId: string;
  yearId: string;
  student?: Student;
  year?: AcademicYear;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;      // Decimal -> number
  datePay: string;     // Ou Date
  mode: Mode;
  receiptNumber: number;
  studentfeeId: string;
  studentfee?: StudentFee;
  createdAt: string;
  updatedAt: string;
}

// Étend le type Session de NextAuth pour inclure les détails de votre utilisateur
// C'est essentiel pour que TypeScript reconnaisse les propriétés supplémentaires comme `role`
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: Role;
    } & DefaultSession['user']; // Garde les propriétés par défaut de DefaultSession['user']
    backendToken?: string;
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    backendToken?: string;
    // Les autres propriétés comme le mot de passe ne sont PAS incluses ici
  }
}