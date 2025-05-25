
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface TagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager = ({ selectedTags, onTagsChange }: TagManagerProps) => {
  const [newTagName, setNewTagName] = useState('');
  const queryClient = useQueryClient();

  // Récupérer les tags
  const { data: tags = [] } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Tag[];
    },
  });

  // Créer un nouveau tag
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase
        .from('blog_tags')
        .insert({
          name,
          slug
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      setNewTagName('');
      toast.success('Tag créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du tag');
    },
  });

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createMutation.mutate(newTagName.trim());
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Tags</h3>
        
        {/* Tags sélectionnés */}
        {selectedTags.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Tags sélectionnés :</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="default" className="flex items-center gap-1">
                    {tag.name}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tagId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Créer un nouveau tag */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouveau tag..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
          />
          <Button 
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || createMutation.isPending}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Liste de tous les tags disponibles */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Tags disponibles :</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {tags.filter(tag => !selectedTags.includes(tag.id)).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {tags.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun tag disponible</p>
        )}
      </div>
    </div>
  );
};

export default TagManager;
