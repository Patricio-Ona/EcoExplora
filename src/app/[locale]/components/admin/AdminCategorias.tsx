'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';

// --- Interfaces de Tipos de Datos para Categorías ---

// Representa una categoría tal como viene de la API
interface Categoria {
  CategoriaID: number;
  Nombre: string;
  Descripcion: string;
}

// Representa los datos del formulario para crear/editar una categoría
export interface CategoriaFormData {
  Nombre: string;
  Descripcion: string;
}


// --- COMPONENTE DEL MODAL DEL FORMULARIO DE CATEGORÍAS ---

interface CategoriaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CategoriaFormData, id?: number) => void;
  categoriaData: Categoria | null; // Datos de la categoría para edición
}

function CategoriaFormModal({ isOpen, onClose, onSave, categoriaData }: CategoriaFormModalProps) {
  const [formData, setFormData] = useState<CategoriaFormData>({
    Nombre: '',
    Descripcion: '',
  });

  // Efecto para rellenar el formulario cuando se edita una categoría
  useEffect(() => {
    if (categoriaData && isOpen) {
      setFormData({
        Nombre: categoriaData.Nombre,
        Descripcion: categoriaData.Descripcion,
      });
    } else {
      // Resetea el formulario si es para crear una nueva
      setFormData({
        Nombre: '',
        Descripcion: '',
      });
    }
  }, [categoriaData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, categoriaData?.CategoriaID);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{categoriaData ? 'Editar Categoría' : 'Crear Categoría'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Nombre">Nombre de la Categoría</label>
            <input
              type="text"
              name="Nombre"
              id="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Descripcion">Descripción</label>
            <textarea
              name="Descripcion"
              id="Descripcion"
              value={formData.Descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- COMPONENTE DEL MODAL DE CONFIRMACIÓN DE BORRADO ---

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-4">Eliminar Categoría</h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            ¿Estás seguro de que quieres eliminar la categoría <strong>{itemName}</strong>? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button type="button" onClick={onConfirm} className="px-6 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DE GESTIÓN DE CATEGORÍAS ---

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store' // Evita que el navegador use datos antiguos
      });
      if (!res.ok) throw new Error('No se pudieron obtener las categorías.');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = () => {
    setEditingCategoria(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirmation = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCategoria = async (formData: CategoriaFormData, id?: number) => {
    const isEditing = id !== undefined;
    const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/categorias`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la categoría.`);
      }
      
      setIsFormModalOpen(false);
      fetchCategorias(); // Vuelve a cargar las categorías para ver los cambios
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleDelete = async () => {
    if (!categoriaToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias/${categoriaToDelete.CategoriaID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar la categoría.');
      
      setIsDeleteModalOpen(false);
      setCategoriaToDelete(null);
      fetchCategorias(); // Vuelve a cargar las categorías para ver los cambios
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    }
  };

  if (isLoading) return <p className="text-center mt-8">Cargando categorías...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Gestión de Categorías</h1>
            <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear Categoría
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.CategoriaID} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 w-16">{categoria.CategoriaID}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{categoria.Nombre}</td>
                  <td className="py-3 px-4 text-gray-600">{categoria.Descripcion}</td>
                  <td className="py-3 px-4 w-24">
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(categoria)} className="text-blue-500 hover:text-blue-700"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => openDeleteConfirmation(categoria)} className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <CategoriaFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveCategoria}
          categoriaData={editingCategoria}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={categoriaToDelete?.Nombre || ''}
        />
      )}
    </>
  );
}
