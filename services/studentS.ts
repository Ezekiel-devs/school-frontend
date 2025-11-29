import api from '@/lib/api';
import type { Student } from '@/types/type'; // Assurez-vous d'avoir ce type

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/student');
  return response.data;
};

export const createStudent = async (studentData: Omit<Student, 'id'|'createdAt'|'updatedAt'>) => {
  const response = await api.post('/student', studentData);
  return response.data;
};

// ... de même pour updateStudent et deleteStudent