
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import BlogFormFields from "./BlogFormFields";

interface BlogCreateFormProps {
  onClose: () => void;
}

const BlogCreateForm = ({ onClose }: BlogCreateFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image_url: "",
    published: false,
    reading_time_minutes: 5
  });

  const createBlogPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const slug = postData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          author_id: user?.id,
          slug: slug
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
      toast.success("Article créé avec succès");
      onClose();
    },
    onError: (error) => {
      console.error('Error creating blog post:', error);
      toast.error("Erreur lors de la création");
    }
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error("Titre et contenu requis");
      return;
    }
    createBlogPostMutation.mutate(formData);
  };

  return (
    <BlogFormFields
      formData={formData}
      onFormDataChange={setFormData}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isSubmitting={createBlogPostMutation.isPending}
      submitText="Créer l'article"
    />
  );
};

export default BlogCreateForm;
