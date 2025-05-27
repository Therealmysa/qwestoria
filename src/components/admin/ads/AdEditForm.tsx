
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
    link_url: ad.link_url || "/",
    position: ad.position || "sidebar",
    is_active: ad.is_active || false,
    start_date: ad.start_date ? new Date(ad.start_date).toISOString().slice(0, 16) : "",
    end_date: ad.end_date ? new Date(ad.end_date).toISOString().slice(0, 16) : ""
  });

  const sitePages = [
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
          ...adData,
          start_date: adData.start_date || null,
          end_date: adData.end_date || null
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
    if (!formData.title || !formData.link_url) {
      toast.error("Titre et page de destination requis");
      return;
    }
    updateAdMutation.mutate(formData);
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
        <Label htmlFor="link_url">Page de destination</Label>
        <Select value={formData.link_url} onValueChange={(value) => setFormData({ ...formData, link_url: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une page" />
          </SelectTrigger>
          <SelectContent>
            {sitePages.map((page) => (
              <SelectItem key={page.value} value={page.value}>
                {page.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
