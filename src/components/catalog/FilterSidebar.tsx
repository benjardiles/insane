import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  filters: {
    priceRange: { min: number; max: number };
    dietary: string[];
    calories: { min: number; max: number };
  };
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, filters }) => {
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'dairy-free', label: 'Dairy Free' },
    { id: 'organic', label: 'Organic' },
  ];

  const handleDietaryChange = (id: string, checked: boolean) => {
    const updatedDietary = checked
      ? [...filters.dietary, id]
      : filters.dietary.filter(item => item !== id);
    
    onFilterChange({
      ...filters,
      dietary: updatedDietary
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  const handleCaloriesChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      calories: { min, max }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min}
            onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange.max)}
            className="w-20"
          />
          <span>to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) => handlePriceChange(filters.priceRange.min, Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Dietary Preferences</h3>
        <div className="space-y-2">
          {dietaryOptions.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={option.id}
                checked={filters.dietary.includes(option.id)}
                onChange={(e) => handleDietaryChange(option.id, e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Calories</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.calories.min}
            onChange={(e) => handleCaloriesChange(Number(e.target.value), filters.calories.max)}
            className="w-20"
          />
          <span>to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.calories.max}
            onChange={(e) => handleCaloriesChange(filters.calories.min, Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
