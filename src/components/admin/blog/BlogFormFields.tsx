
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "./RichTextEditor";

interface BlogFormData {
  title: string;
  summary: string;
  content: string;
  image_url: string;
  published: boolean;
  reading_time_minutes: number;
}

interface BlogFormFieldsProps {
  formData: BlogFormData;
  onFormDataChange: (data: BlogFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
}

const BlogFormFields = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  submitText 
}: BlogFormFieldsProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const updateField = (field: keyof BlogFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Titre de l'article"
          required
        />
      </div>
      <div>
        <Label htmlFor="summary">Résumé</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          placeholder="Résumé de l'article"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="content">Contenu</Label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => updateField('content', content)}
          placeholder="Contenu de l'article"
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
        <Label htmlFor="reading_time">Temps de lecture (minutes)</Label>
        <Input
          id="reading_time"
          type="number"
          value={formData.reading_time_minutes}
          onChange={(e) => updateField('reading_time_minutes', parseInt(e.target.value) || 5)}
          min="1"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => updateField('published', checked)}
        />
        <Label htmlFor="published">Publier immédiatement</Label>
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

export default BlogFormFields;
