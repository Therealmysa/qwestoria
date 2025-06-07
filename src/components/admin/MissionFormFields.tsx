
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MissionFormData {
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  starts_at: string;
  ends_at: string;
  external_link: string;
  is_daily: boolean;
  reset_hours: number;
  difficulty_level: string;
  platform: string;
  mission_type: string;
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
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Titre de la mission"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
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
          <Label htmlFor="difficulty_level">Niveau de difficulté</Label>
          <Select value={formData.difficulty_level} onValueChange={(value) => updateField('difficulty_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facile">Facile</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="difficile">Difficile</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="platform">Plateforme</Label>
          <Select value={formData.platform} onValueChange={(value) => updateField('platform', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la plateforme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes</SelectItem>
              <SelectItem value="pc">PC</SelectItem>
              <SelectItem value="console">Console</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mission_type">Type de mission</Label>
          <Select value={formData.mission_type} onValueChange={(value) => updateField('mission_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="victoire">Victoire</SelectItem>
              <SelectItem value="elimination">Élimination</SelectItem>
              <SelectItem value="survie">Survie</SelectItem>
              <SelectItem value="exploration">Exploration</SelectItem>
              <SelectItem value="defi">Défi</SelectItem>
              <SelectItem value="social">Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2">
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

        <div className="flex items-center space-x-2">
          <Switch
            id="is_daily"
            checked={formData.is_daily}
            onCheckedChange={(checked) => updateField('is_daily', checked)}
          />
          <Label htmlFor="is_daily">Mission journalière (répétable)</Label>
        </div>

        {formData.is_daily && (
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="reset_hours">Heures avant réinitialisation</Label>
            <Input
              id="reset_hours"
              type="number"
              min="1"
              max="168"
              value={formData.reset_hours}
              onChange={(e) => updateField('reset_hours', parseInt(e.target.value) || 24)}
              placeholder="24"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Entre 1 et 168 heures (1 semaine max)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionFormFields;
