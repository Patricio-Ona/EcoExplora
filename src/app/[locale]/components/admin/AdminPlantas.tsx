'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';

// --- Interfaces de Tipos de Datos ---

interface Planta {
  PlantaID: number;
  NombreComun: string;
  NombreCientifico: string;
  ImagenURL: string;
  Categoria: string;
  Zona: string;
  Descripcion?: string;
  UsuarioID?: number;
  VecesConsumida?: number;
  FechaRegistro?: string;
}

// CORREGIDO: Se eliminan Latitud y Longitud para coincidir con la API
export interface PlantaFormData {
  NombreComun: string;
  NombreCientifico: string;
  Descripcion: string;
  ImagenURL: string;
  CategoriaID: number;
  ZonaID: number;
  UsuarioID: number;
  VecesConsumida: number;
  FechaRegistro: string;
}

interface Categoria {
  CategoriaID: number;
  Nombre: string;
}

interface Zona {
  ZonaID: number;
  NombreZona: string;
}

// AÑADIDO: Interfaz para el usuario
interface Usuario {
    UsuarioID: number;
    Nombre: string;
}


// --- COMPONENTE DEL MODAL DEL FORMULARIO DE PLANTAS ---

interface PlantaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: PlantaFormData, id?: number) => void;
  plantaData: Planta | null;
}

function PlantaFormModal({ isOpen, onClose, onSave, plantaData }: PlantaFormModalProps) {
  const [formData, setFormData] = useState<PlantaFormData>({
    NombreComun: '',
    NombreCientifico: '',
    Descripcion: '',
    ImagenURL: '',
    CategoriaID: 0,
    ZonaID: 0,
    UsuarioID: 1, 
    VecesConsumida: 0,
    FechaRegistro: '',
  });
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  // AÑADIDO: Estado para guardar la lista de usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Efecto para cargar datos para los dropdowns (categorías, zonas y usuarios)
  useEffect(() => {
    if (isOpen) {
      const fetchDataForDropdowns = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const headers = { 'Authorization': `Bearer ${token}` };
          
          // AÑADIDO: Se incluye la petición para obtener los usuarios
          const [resCategorias, resZonas, resUsuarios] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/zonas`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, { headers })
          ]);

          if (!resCategorias.ok || !resZonas.ok || !resUsuarios.ok) {
            throw new Error('No se pudieron cargar los datos para el formulario.');
          }

          const dataCategorias = await resCategorias.json();
          const dataZonas = await resZonas.json();
          const dataUsuarios = await resUsuarios.json();
          
          setCategorias(dataCategorias);
          setZonas(dataZonas);
          setUsuarios(dataUsuarios);

        } catch (error) {
          console.error(error);
          alert('Error al cargar datos para los desplegables.');
        }
      };
      fetchDataForDropdowns();
    }
  }, [isOpen]);

  // Efecto para OBTENER DATOS COMPLETOS usando la API getByNombre
  useEffect(() => {
    const loadFullPlantaData = async () => {
      if (plantaData && isOpen && categorias.length > 0 && zonas.length > 0) {
        setIsLoadingDetails(true);
        try {
          const token = localStorage.getItem('authToken');
          const url = `${process.env.NEXT_PUBLIC_API_URL}/plantas/nombre/${encodeURIComponent(plantaData.NombreComun)}`;
          
          const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!res.ok) {
            throw new Error(`Error ${res.status}: No se pudieron obtener los detalles de ${plantaData.NombreComun}`);
          }
          
          const fullPlantaData = await res.json();
          if (!fullPlantaData) {
            throw new Error(`No se encontró la planta ${plantaData.NombreComun}`);
          }

          const categoriaActual = categorias.find(c => c.Nombre === fullPlantaData.Categoria);
          const zonaActual = zonas.find(z => z.NombreZona === fullPlantaData.Zona);
          const fechaRegistro = fullPlantaData.FechaRegistro 
            ? new Date(fullPlantaData.FechaRegistro).toISOString().split('T')[0] 
            : '';

          setFormData({
              NombreComun: fullPlantaData.NombreComun,
              NombreCientifico: fullPlantaData.NombreCientifico,
              ImagenURL: fullPlantaData.ImagenURL,
              CategoriaID: categoriaActual?.CategoriaID || 0,
              ZonaID: zonaActual?.ZonaID || 0,
              Descripcion: fullPlantaData.Descripcion || '',
              UsuarioID: fullPlantaData.UsuarioID || 1,
              VecesConsumida: fullPlantaData.VecesConsumida || 0,
              FechaRegistro: fechaRegistro,
          });

        } catch (error) {
          console.error(error);
          alert('No se pudieron cargar todos los detalles de la planta. Algunos campos pueden estar vacíos.');
        } finally {
          setIsLoadingDetails(false);
        }
      } else if (!plantaData) {
        // Resetea el formulario para el modo "Crear"
        setFormData({
          NombreComun: '', NombreCientifico: '', Descripcion: '', ImagenURL: '',
          CategoriaID: 0, ZonaID: 0, UsuarioID: 1, VecesConsumida: 0,
          FechaRegistro: '',
        });
      }
    };

    if (isOpen) {
        loadFullPlantaData();
    }
  }, [plantaData, isOpen, categorias, zonas]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: string | number = value;
    if (type === 'number') {
        finalValue = value === '' ? '' : parseFloat(value);
    } else if (name === 'CategoriaID' || name === 'ZonaID' || name === 'UsuarioID') {
        finalValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.CategoriaID === 0 || formData.ZonaID === 0) {
        alert("Por favor, selecciona una categoría y una zona.");
        return;
    }
    onSave(formData, plantaData?.PlantaID);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto relative">
        {isLoadingDetails && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-lg">
            <p className="text-lg font-semibold text-gray-700">Cargando detalles...</p>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6">{plantaData ? 'Editar Planta' : 'Crear Planta'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="NombreComun">Nombre Común</label>
            <input type="text" name="NombreComun" id="NombreComun" value={formData.NombreComun} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="NombreCientifico">Nombre Científico</label>
            <input type="text" name="NombreCientifico" id="NombreCientifico" value={formData.NombreCientifico} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Descripcion">Descripción</label>
            <textarea name="Descripcion" id="Descripcion" value={formData.Descripcion} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows={3}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ImagenURL">URL de la Imagen</label>
            <input type="text" name="ImagenURL" id="ImagenURL" value={formData.ImagenURL} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="CategoriaID">Categoría</label>
              <select name="CategoriaID" id="CategoriaID" value={formData.CategoriaID} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                <option value={0} disabled>Selecciona una Categoría</option>
                {categorias.map(cat => <option key={cat.CategoriaID} value={cat.CategoriaID}>{cat.Nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ZonaID">Zona</label>
              <select name="ZonaID" id="ZonaID" value={formData.ZonaID} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                <option value={0} disabled>Selecciona una Zona</option>
                {zonas.map(zona => <option key={zona.ZonaID} value={zona.ZonaID}>{zona.NombreZona}</option>)}
              </select>
            </div>
          </div>
          
          {/* AÑADIDO: Selector de Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="UsuarioID">Usuario que registra</label>
            <select name="UsuarioID" id="UsuarioID" value={formData.UsuarioID} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
              {usuarios.map(user => <option key={user.UsuarioID} value={user.UsuarioID}>{user.Nombre}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="VecesConsumida">Veces Consumida</label>
              <input type="number" name="VecesConsumida" id="VecesConsumida" value={formData.VecesConsumida} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="FechaRegistro">Fecha de Registro</label>
              <input type="date" name="FechaRegistro" id="FechaRegistro" value={formData.FechaRegistro} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
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
        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-4">Eliminar Planta</h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            ¿Estás seguro de que quieres eliminar a <strong>{itemName}</strong>? Esta acción no se puede deshacer.
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

// --- COMPONENTE PRINCIPAL DE GESTIÓN DE PLANTAS ---

export default function AdminPlantas() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlanta, setEditingPlanta] = useState<Planta | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plantaToDelete, setPlantaToDelete] = useState<Planta | null>(null);

  const fetchPlantas = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudieron obtener las plantas.');
      const data = await res.json();
      setPlantas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantas();
  }, []);

  const handleCreate = () => {
    setEditingPlanta(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (planta: Planta) => {
    setEditingPlanta(planta);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirmation = (planta: Planta) => {
    setPlantaToDelete(planta);
    setIsDeleteModalOpen(true);
  };

  const handleSavePlanta = async (formData: PlantaFormData, id?: number) => {
    const isEditing = id !== undefined;
    const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/plantas/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/plantas`;
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
        throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la planta.`);
      }
      
      setIsFormModalOpen(false);
      fetchPlantas();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleDelete = async () => {
    if (!plantaToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantas/${plantaToDelete.PlantaID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar la planta.');
      
      setIsDeleteModalOpen(false);
      setPlantaToDelete(null);
      fetchPlantas();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    }
  };

  if (isLoading) return <p className="text-center mt-8">Cargando plantas...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Gestión de Plantas</h1>
            <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear Planta
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Imagen</th>
                <th className="py-3 px-4 text-left">Nombre Común</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Zona</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plantas.map((planta) => (
                <tr key={planta.PlantaID} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{planta.PlantaID}</td>
                  <td className="py-3 px-4">
                    <img 
                      src={planta.ImagenURL} 
                      alt={`Imagen de ${planta.NombreComun}`} 
                      className="h-16 w-16 object-cover rounded-md shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src="https://placehold.co/64x64/e2e8f0/94a3b8?text=Error";
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{planta.NombreComun}</td>
                  <td className="py-3 px-4">{planta.Categoria}</td>
                  <td className="py-3 px-4">{planta.Zona}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => handleEdit(planta)} className="text-blue-500 hover:text-blue-700"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => openDeleteConfirmation(planta)} className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <PlantaFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSavePlanta}
          plantaData={editingPlanta}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={plantaToDelete?.NombreComun || ''}
        />
      )}
    </>
  );
}
