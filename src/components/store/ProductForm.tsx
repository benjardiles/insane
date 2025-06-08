import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Definir las categorías disponibles (mismas que en la página principal)
const PRODUCT_CATEGORIES = [
  'Comida Rápida',
  'Bebidas',
  'Postres',
  'Ensaladas',
  'Platos Principales',
  'Aperitivos',
  'Vegetariano',
  'Vegano',
  'Sin Gluten',
  'Otros'
];

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    tags: string[];
    deliveryOptions: {
      delivery: boolean;
      pickup: boolean;
    };
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const defaultData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    tags: [] as string[],
    deliveryOptions: {
      delivery: true,
      pickup: true,
    },
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  };

  const [formData, setFormData] = useState(initialData || defaultData);
  const [tagInput, setTagInput] = useState('');

  // Determinar si estamos editando basado en si hay initialData con id
  const isEditing = initialData && initialData.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultData,
        ...initialData,
        nutritionalInfo: {
          ...defaultData.nutritionalInfo,
          ...initialData.nutritionalInfo
        }
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleNutritionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        calories: prev.nutritionalInfo?.calories || 0,
        protein: prev.nutritionalInfo?.protein || 0,
        carbs: prev.nutritionalInfo?.carbs || 0,
        fat: prev.nutritionalInfo?.fat || 0,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleDeliveryOptionChange = (option: 'delivery' | 'pickup', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        [option]: checked
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Empanada de Pino"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="price">Precio ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ej: 2500"
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock (unidades)</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Ej: 50"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe tu producto..."
            required
          />
        </div>
        
        <div>
          <Label>Opciones de Entrega</Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="delivery"
                checked={formData.deliveryOptions.delivery}
                onChange={(e) => handleDeliveryOptionChange('delivery', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="delivery">Entrega a Domicilio</Label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pickup"
                checked={formData.deliveryOptions.pickup}
                onChange={(e) => handleDeliveryOptionChange('pickup', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="pickup">Retiro en Tienda</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Etiquetas</Label>
          <div className="flex mt-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Añadir etiqueta (ej: picante, vegano)"
              className="mr-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Añadir
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Información Nutricional (opcional)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div>
              <Label htmlFor="calories">Calorías</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                min="0"
                value={formData.nutritionalInfo?.calories || ''}
                onChange={handleNutritionalInfoChange}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="protein">Proteínas (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.protein || ''}
                onChange={handleNutritionalInfoChange}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbohidratos (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.carbs || ''}
                onChange={handleNutritionalInfoChange}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="fat">Grasas (g)</Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.fat || ''}
                onChange={handleNutritionalInfoChange}
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;
