// src/app/types/admin-types.ts

// Define el tipo de dato para un objeto Usuario, tal como lo devuelve la API.
export interface Usuario {
  UsuarioID: number;
  Nombre: string;
  Correo: string;
  NombreRol: string;
  RolID: number;
}

// Define la forma de los datos que el formulario de usuario manejará.
export type UsuarioFormData = Omit<Usuario, 'UsuarioID' | 'NombreRol'> & { Contrasena?: string };

// Define el tipo de dato para un objeto Rol.
export interface Rol {
  RolID: number;
  NombreRol: string;
}
