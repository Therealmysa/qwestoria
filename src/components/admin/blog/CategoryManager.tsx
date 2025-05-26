
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Folder } from 'lucide-react';

interface CategoryManagerProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryManager = ({ selectedCategories, onCategoriesChange }: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  // Categories locales temporaires
  const [localCategories, setLocalCategories] = useState([
    { id: '1', name: 'Actualités', color: '#3B82F6' },
    { id: '2', name: 'Tutoriels', color: '#10B981' },
    { id: '3', name: 'Guides', color: '#F59E0B' },
    { id: '4', name: 'News', color: '#EF4444' },
  ]);

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setLocalCategories([...localCategories, newCategory]);
      setNewCategoryName('');
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <Folder className="h-4 w-4" />
          Catégories
        </h3>
        
        {/* Créer une nouvelle catégorie */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouvelle catégorie..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            className="input-enhanced"
          />
          <Button 
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
            size="sm"
            className="button-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Liste des catégories */}
        <div className="flex flex-wrap gap-2">
          {localCategories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300'
              }`}
              onClick={() => toggleCategory(category.id)}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm">{category.name}</span>
              {selectedCategories.includes(category.id) && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent dark:text-purple-300 dark:hover:text-purple-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoriesChange(selectedCategories.filter(id => id !== category.id));
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {localCategories.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Aucune catégorie disponible</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
