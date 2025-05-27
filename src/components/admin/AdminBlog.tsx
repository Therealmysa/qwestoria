
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, BookOpen, MessageSquare, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('published');

      if (postsError) throw postsError;

      const { data: comments, error: commentsError } = await supabase
        .from('blog_post_comments')
        .select('id');

      if (commentsError) throw commentsError;

      const totalPosts = posts.length;
      const publishedPosts = posts.filter(post => post.published).length;
      const totalComments = comments.length;

      return {
        totalPosts,
        publishedPosts,
        totalViews: 0, // Pas de colonne views_count dans le schéma
        totalComments
      };
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
      toast.success("Article supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, updates }: { postId: string, updates: any }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
      toast.success("Article mis à jour avec succès");
      setSelectedPost(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handlePostUpdate = (updates: any) => {
    if (selectedPost) {
      updatePostMutation.mutate({ postId: selectedPost.id, updates });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total articles</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalPosts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Publiés</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.publishedPosts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 sm:h-8 w-6 sm:w-8 text-purple-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Vues totales</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalViews?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 text-orange-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Commentaires</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalComments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion du Blog</span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Article
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
              <p className="text-sm">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-3">
                {blogPosts?.map((post) => (
                  <Card key={post.id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="h-12 w-12 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm mb-1 line-clamp-2">{post.title}</div>
                          <div className="text-xs text-gray-500 mb-2">Par {post.author_id}</div>
                          <div className="flex flex-wrap gap-1">
                            {post.published ? (
                              <Badge className="bg-green-500 text-white text-xs">Publié</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Brouillon</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPost(post)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">Gérer {post.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="published" className="text-sm">Publié</Label>
                                <Switch
                                  id="published"
                                  checked={post.published}
                                  onCheckedChange={(checked) =>
                                    handlePostUpdate({ published: checked })
                                  }
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Publié le</div>
                        <div className="font-semibold">{formatDate(post.created_at)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {post.image_url && (
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium max-w-xs truncate">{post.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{post.summary}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{post.author_id}</span>
                        </TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge className="bg-green-500 text-white text-xs">Publié</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Brouillon</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatDate(post.created_at)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedPost(post)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Gérer {post.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="published"
                                      checked={post.published}
                                      onCheckedChange={(checked) =>
                                        handlePostUpdate({ published: checked })
                                      }
                                    />
                                    <Label htmlFor="published">Publié</Label>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePostMutation.mutate(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
