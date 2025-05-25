
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
}

interface CategoryManagerProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryManager = ({ selectedCategories, onCategoriesChange }: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const queryClient = useQueryClient();

  // Récupérer les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Créer une nouvelle catégorie
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase
        .from('blog_categories')
        .insert({
          name,
          slug,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setNewCategoryName('');
      toast.success('Catégorie créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la catégorie');
    },
  });

  // Modifier une catégorie
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase
        .from('blog_categories')
        .update({ name, slug })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setEditingCategory(null);
      setEditingName('');
      toast.success('Catégorie modifiée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la modification de la catégorie');
    },
  });

  // Supprimer une catégorie
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Catégorie supprimée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la catégorie');
    },
  });

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createMutation.mutate(newCategoryName.trim());
    }
  };

  const handleUpdateCategory = (id: string) => {
    if (editingName.trim()) {
      updateMutation.mutate({ id, name: editingName.trim() });
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
        <h3 className="text-lg font-medium mb-3">Catégories</h3>
        
        {/* Créer une nouvelle catégorie */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouvelle catégorie..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
          />
          <Button 
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || createMutation.isPending}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Liste des catégories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => toggleCategory(category.id)}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              
              {editingCategory === category.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-6 px-1 text-xs w-20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateCategory(category.id);
                      if (e.key === 'Escape') {
                        setEditingCategory(null);
                        setEditingName('');
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateCategory(category.id);
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm">{category.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category.id);
                      setEditingName(category.name);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-gray-500 text-sm">Aucune catégorie disponible</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
