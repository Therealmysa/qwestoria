
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface BlogCommentsProps {
  postId: string;
  className?: string;
}

const BlogComments = ({ postId, className = "" }: BlogCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_post_comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('blog_post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      toast.success("Commentaire ajouté avec succès !");
      fetchComments();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_post_comments')
        .update({ 
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEditingComment(null);
      setEditContent("");
      toast.success("Commentaire modifié avec succès !");
      fetchComments();
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success("Commentaire supprimé avec succès !");
      fetchComments();
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      {user ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajoutez votre commentaire..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Publication..." : "Publier"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Vous devez être connecté pour commenter cet article.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des commentaires...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar_url} />
                      <AvatarFallback>
                        {comment.profiles?.username?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {comment.profiles?.username || 'Utilisateur inconnu'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                        {comment.updated_at !== comment.created_at && (
                          <span className="ml-1">(modifié)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {user?.id === comment.user_id && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(comment)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditComment(comment.id)}
                        disabled={!editContent.trim()}
                      >
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComments;
