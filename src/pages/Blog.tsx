import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, User, Eye, Clock, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  reading_time_minutes: number | null;
}

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setPosts(data as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Impossible de charger les articles de blog");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedPosts = () => {
    let filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (sortBy) {
      case "oldest":
        return filteredPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "alphabetical":
        return filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
      default: // newest
        return filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleReadArticle = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-500 dark:to-cyan-400 mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez les dernières actualités, guides et astuces Fortnite
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 transform hover:scale-[1.02] transition-all duration-300">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Rechercher un article..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 backdrop-blur-2xl border-gray-200 dark:border-slate-600">
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="alphabetical">Alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Chargement des articles...</span>
          </div>
        ) : getFilteredAndSortedPosts().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredAndSortedPosts().map((post) => (
              <Card 
                key={post.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg shadow-xl transform hover:scale-[1.05] hover:-translate-y-2 border border-blue-100 dark:border-blue-800"
              >
                {post.image_url && (
                  <div className="aspect-video overflow-hidden cursor-pointer" onClick={() => handleReadArticle(post.id)}>
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time_minutes || 5} min de lecture</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer" onClick={() => handleReadArticle(post.id)}>
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-4">
                  {post.summary ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                      {post.summary}
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                      {truncateContent(post.content)}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Article
                    </Badge>
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                      Fortnite
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 border-t border-gray-100 dark:border-slate-700">
                  <Button 
                    variant="ghost" 
                    className="w-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-cyan-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-cyan-900/20 transition-all duration-300" 
                    onClick={() => handleReadArticle(post.id)}
                  >
                    Lire l'article
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl p-12 text-center shadow-xl border border-blue-100 dark:border-blue-800 transform hover:scale-[1.02] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
              {searchQuery ? "Aucun article trouvé" : "Aucun article publié"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? "Aucun article ne correspond à votre recherche. Essayez d'autres mots-clés." 
                : "Les articles de blog seront bientôt disponibles. Revenez plus tard pour découvrir les dernières actualités !"
              }
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")} 
                className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
