
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  FileText,
  Loader2,
  Save,
  BookOpen,
  Tag,
  Folder
} from "lucide-react";
import RichTextEditor from "./blog/RichTextEditor";
import CategoryManager from "./blog/CategoryManager";
import TagManager from "./blog/TagManager";

interface BlogPost {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  slug: string | null;
}

const blogFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  summary: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis"),
  image_url: z.string().url("URL invalide").optional().or(z.literal("")),
  published: z.boolean(),
  featured: z.boolean().optional(),
  meta_description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

const AdminBlog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      image_url: "",
      published: false,
      featured: false,
      meta_description: "",
    },
  });

  // Récupérer tous les articles de blog
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  // Mutation pour créer/modifier un article
  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const slug = data.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      if (editingPost) {
        // Modifier l'article existant
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            content: data.content,
            summary: data.summary || null,
            image_url: data.image_url || null,
            published: data.published,
            slug: slug,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        // Créer un nouvel article
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: data.title,
            content: data.content,
            summary: data.summary || null,
            image_url: data.image_url || null,
            published: data.published,
            slug: slug,
            author_id: user!.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setDialogOpen(false);
      setEditingPost(null);
      setSelectedCategories([]);
      setSelectedTags([]);
      form.reset();
      toast.success(editingPost ? "Article modifié avec succès" : "Article créé avec succès");
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("Erreur lors de la sauvegarde de l'article");
    },
  });

  // Mutation pour supprimer un article
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success("Article supprimé avec succès");
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression de l'article");
    },
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      summary: post.summary || "",
      content: post.content,
      image_url: post.image_url || "",
      published: post.published,
    });
    setDialogOpen(true);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteMutation.mutate(postId);
    }
  };

  const onSubmit = (data: BlogFormData) => {
    saveMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des articles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7" />
            Gestion du Blog CMS
          </h2>
          <p className="text-gray-600">Créez et gérez les articles de blog avec un éditeur avancé</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPost(null);
              setSelectedCategories([]);
              setSelectedTags([]);
              form.reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Article
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingPost ? "Modifier l'article" : "Créer un nouvel article"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Colonne principale - Contenu */}
                  <div className="lg:col-span-2 space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'article</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Entrez un titre accrocheur..." 
                              {...field}
                              className="text-lg font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Résumé de l'article</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Résumé court qui apparaîtra dans les listes..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contenu de l'article</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Rédigez votre article ici..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Colonne latérale - Paramètres */}
                  <div className="space-y-6">
                    {/* Statut de publication */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Publication
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Publier l'article</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Image à la une */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Image à la une</h3>
                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="URL de l'image..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch('image_url') && (
                        <div className="mt-2">
                          <img 
                            src={form.watch('image_url')} 
                            alt="Aperçu" 
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Catégories */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <CategoryManager
                        selectedCategories={selectedCategories}
                        onCategoriesChange={setSelectedCategories}
                      />
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <TagManager
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingPost ? "Mettre à jour" : "Publier l'article"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Articles</p>
              <p className="text-2xl font-bold">{posts?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Publiés</p>
              <p className="text-2xl font-bold">
                {posts?.filter(p => p.published).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Brouillons</p>
              <p className="text-2xl font-bold">
                {posts?.filter(p => !p.published).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Folder className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cette semaine</p>
              <p className="text-2xl font-bold">
                {posts?.filter(p => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(p.created_at) > weekAgo;
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des articles améliorée */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Articles récents</h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Modifié le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-start space-x-3">
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      {post.summary && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {post.summary}
                        </p>
                      )}
                      {post.slug && (
                        <p className="text-xs text-blue-500">/{post.slug}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">Vous</span>
                </TableCell>
                <TableCell>{formatDate(post.created_at)}</TableCell>
                <TableCell>{formatDate(post.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {posts?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun article
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier article avec l'éditeur avancé.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier article
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
