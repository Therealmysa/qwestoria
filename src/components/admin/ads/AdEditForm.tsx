
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdEditFormProps {
  ad: any;
  onClose: () => void;
}

const AdEditForm = ({ ad, onClose }: AdEditFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: ad.title || "",
    description: ad.description || "",
    image_url: ad.image_url || "",
    destination_url: ad.link_url || "",
    position: ad.position || "sidebar",
    is_active: ad.is_active || false,
    start_date: ad.start_date ? new Date(ad.start_date).toISOString().slice(0, 16) : "",
    end_date: ad.end_date ? new Date(ad.end_date).toISOString().slice(0, 16) : "",
    target_pages: ad.target_pages || []
  });

  const availablePages = [
    { value: "/", label: "Accueil" },
    { value: "/missions", label: "Missions" },
    { value: "/blog", label: "Blog" },
    { value: "/shop", label: "Boutique" },
    { value: "/teammates", label: "Coéquipiers" },
    { value: "/messages", label: "Messagerie" },
    { value: "/leaderboard", label: "Classement" },
    { value: "/fortnite-shop", label: "Boutique Fortnite" },
    { value: "/dashboard", label: "Dashboard" },
    { value: "/profile", label: "Profil" }
  ];

  const updateAdMutation = useMutation({
    mutationFn: async (adData: any) => {
      const { error } = await supabase
        .from('advertisements')
        .update({
          title: adData.title,
          description: adData.description,
          image_url: adData.image_url,
          link_url: adData.destination_url,
          position: adData.position,
          is_active: adData.is_active,
          start_date: adData.start_date || null,
          end_date: adData.end_date || null,
          target_pages: adData.target_pages
        })
        .eq('id', ad.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements-stats'] });
      toast.success("Publicité mise à jour avec succès");
      onClose();
    },
    onError: (error) => {
      console.error('Error updating advertisement:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.destination_url || formData.target_pages.length === 0) {
      toast.error("Titre, URL de destination et au moins une page cible requis");
      return;
    }
    updateAdMutation.mutate(formData);
  };

  const handlePageToggle = (pageValue: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        target_pages: [...prev.target_pages, pageValue]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        target_pages: prev.target_pages.filter(page => page !== pageValue)
      }));
    }
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
        <Label htmlFor="destination_url">URL de destination</Label>
        <Input
          id="destination_url"
          value={formData.destination_url}
          onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
          placeholder="https://example.com ou /page-interne"
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
        <Label>Pages où afficher la publicité</Label>
        <div className="grid grid-cols-2 gap-3 mt-2 max-h-40 overflow-y-auto">
          {availablePages.map((page) => (
            <div key={page.value} className="flex items-center space-x-2">
              <Checkbox
                id={`page-${page.value}`}
                checked={formData.target_pages.includes(page.value)}
                onCheckedChange={(checked) => handlePageToggle(page.value, checked as boolean)}
              />
              <Label htmlFor={`page-${page.value}`} className="text-sm">
                {page.label}
              </Label>
            </div>
          ))}
        </div>
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
        <Label htmlFor="is_active">Publicité active</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={updateAdMutation.isPending}>
          {updateAdMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
};

export default AdEditForm;
