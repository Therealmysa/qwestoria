
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ShopItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_vip_only: boolean;
  available_until: string;
}

interface ShopItemFormFieldsProps {
  formData: ShopItemFormData;
  onFormDataChange: (data: ShopItemFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
}

const ShopItemFormFields = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  submitText 
}: ShopItemFormFieldsProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const updateField = (field: keyof ShopItemFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Nom de l'article"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Description de l'article"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="price">Prix (BradCoins)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
          placeholder="Prix en BradCoins"
        />
      </div>
      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          placeholder="Catégorie"
        />
      </div>
      <div>
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => updateField('image_url', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="available_until">Disponible jusqu'à (optionnel)</Label>
        <Input
          id="available_until"
          type="datetime-local"
          value={formData.available_until}
          onChange={(e) => updateField('available_until', e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_vip_only"
          checked={formData.is_vip_only}
          onCheckedChange={(checked) => updateField('is_vip_only', checked)}
        />
        <Label htmlFor="is_vip_only">Réservé aux VIP</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Traitement..." : submitText}
        </Button>
      </div>
    </form>
  );
};

export default ShopItemFormFields;
