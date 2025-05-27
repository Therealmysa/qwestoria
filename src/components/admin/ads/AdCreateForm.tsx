
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdCreateFormProps {
  onClose: () => void;
}

const AdCreateForm = ({ onClose }: AdCreateFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    position: "sidebar",
    is_active: true,
    start_date: "",
    end_date: ""
  });

  const createAdMutation = useMutation({
    mutationFn: async (adData: any) => {
      const { error } = await supabase
        .from('advertisements')
        .insert([{
          ...adData,
          start_date: adData.start_date || null,
          end_date: adData.end_date || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements-stats'] });
      toast.success("Publicité créée avec succès");
      onClose();
    },
    onError: (error) => {
      console.error('Error creating advertisement:', error);
      toast.error("Erreur lors de la création");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link_url) {
      toast.error("Titre et lien requis");
      return;
    }
    createAdMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titre de la publicité"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de la publicité"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="link_url">Lien de destination</Label>
        <Input
          id="link_url"
          value={formData.link_url}
          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
      <div>
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sidebar">Barre latérale</SelectItem>
            <SelectItem value="banner">Bannière</SelectItem>
            <SelectItem value="popup">Popup</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="start_date">Date de début (optionnel)</Label>
        <Input
          id="start_date"
          type="datetime-local"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="end_date">Date de fin (optionnel)</Label>
        <Input
          id="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Activer immédiatement</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={createAdMutation.isPending}>
          {createAdMutation.isPending ? "Création..." : "Créer la publicité"}
        </Button>
      </div>
    </form>
  );
};

export default AdCreateForm;
