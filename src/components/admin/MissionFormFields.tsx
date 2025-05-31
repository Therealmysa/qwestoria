
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MissionFormData {
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  starts_at: string;
  ends_at: string;
  external_link: string;
}

interface MissionFormFieldsProps {
  formData: MissionFormData;
  onChange: (data: MissionFormData) => void;
}

const MissionFormFields = ({ formData, onChange }: MissionFormFieldsProps) => {
  const updateField = (field: keyof MissionFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Titre de la mission"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Description de la mission"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="reward_coins">Récompense (BradCoins)</Label>
        <Input
          id="reward_coins"
          type="number"
          value={formData.reward_coins}
          onChange={(e) => updateField('reward_coins', parseInt(e.target.value) || 0)}
          placeholder="Nombre de BradCoins"
        />
      </div>
      <div>
        <Label htmlFor="external_link">Lien externe (optionnel)</Label>
        <Input
          id="external_link"
          value={formData.external_link}
          onChange={(e) => updateField('external_link', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="starts_at">Date de début</Label>
        <Input
          id="starts_at"
          type="datetime-local"
          value={formData.starts_at}
          onChange={(e) => updateField('starts_at', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="ends_at">Date de fin (optionnel)</Label>
        <Input
          id="ends_at"
          type="datetime-local"
          value={formData.ends_at}
          onChange={(e) => updateField('ends_at', e.target.value)}
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
    </div>
  );
};

export default MissionFormFields;
