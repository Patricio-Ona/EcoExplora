'use client';

import { useEffect, useState } from 'react';
// Se añade AlertTriangle a la importación de lucide-react
import { Edit, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';
import UserFormModal from './UserFormModal';
// Se elimina la importación del componente del modal de eliminación, ya que ahora estará en este mismo archivo
// import ConfirmDeleteModal from './ConfirmDeleteModal';

// Tipos de datos
interface Usuario {
  UsuarioID: number;
  Nombre: string;
  Correo: string;
  NombreRol: string;
  RolID: number;
}

export type UsuarioFormData = Omit<Usuario, 'UsuarioID' | 'NombreRol'> & { RolID: number, Contrasena?: string };

// --- COMPONENTE DEL MODAL DE CONFIRMACIÓN (ahora local) ---
// Se ha movido el código de ConfirmDeleteModal aquí para evitar errores de importación.
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, userName }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-4">
          Eliminar Usuario
        </h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            ¿Estás seguro de que quieres eliminar a <strong>{userName}</strong>? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ---
export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudieron obtener los usuarios.');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al obtener los usuarios.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirmation = (usuario: Usuario) => {
    console.log('Abriendo modal de confirmación para:', usuario);
    setUserToDelete(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (formData: UsuarioFormData, id?: number) => {
    const isEditing = id !== undefined;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/usuarios`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario.`);
      }
      
      setIsFormModalOpen(false);
      fetchUsuarios();

    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('Ocurrió un error inesperado al guardar.');
      }
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userToDelete.UsuarioID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar el usuario.');
      
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsuarios();

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Ocurrió un error inesperado al eliminar.');
      }
    }
  };

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-end mb-4">
          <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600">
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Usuario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Correo</th>
                <th className="py-3 px-4 text-left">Rol</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.UsuarioID} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{usuario.UsuarioID}</td>
                  <td className="py-3 px-4">{usuario.Nombre}</td>
                  <td className="py-3 px-4">{usuario.Correo}</td>
                  <td className="py-3 px-4">{usuario.NombreRol}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => handleEdit(usuario)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => openDeleteConfirmation(usuario)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <UserFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveUser}
          userData={editingUser}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          userName={userToDelete?.Nombre || ''}
        />
      )}
    </>
  );
}
