
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  User,
  Eye,
  Clock,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
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
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-blue-400 dark:via-blue-500 dark:to-cyan-400 mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les dernières actualités, guides et astuces Fortnite
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 dark:bg-black/20 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl dark:shadow-blue-500/20 transform hover:scale-[1.02] transition-all duration-300">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-blue-300" />
            <Input
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-black/30 dark:border-white/20 dark:text-white dark:placeholder-blue-300/60 border-blue-200 focus:border-blue-400 dark:focus:border-blue-400"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 dark:bg-black/30 dark:border-white/20 dark:text-white border-blue-200">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent className="dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/15">
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="alphabetical">Alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-blue-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-300">Chargement des articles...</span>
          </div>
        ) : getFilteredAndSortedPosts().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredAndSortedPosts().map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 dark:bg-black/20 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md shadow-xl transform hover:scale-[1.05] hover:-translate-y-2 dark:shadow-blue-500/30 dark:hover:shadow-blue-500/40">
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
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-blue-300/80 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                    <Separator orientation="vertical" className="h-4 dark:bg-white/20" />
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time_minutes || 5} min de lecture</span>
                  </div>
                  <CardTitle 
                    className="text-xl text-gray-800 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer group-hover:text-gradient-modern"
                    onClick={() => handleReadArticle(post.id)}
                  >
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
                    <Badge variant="secondary" className="text-xs dark:bg-blue-600/30 dark:text-blue-300 dark:border-blue-500/40">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Article
                    </Badge>
                    <Badge variant="outline" className="text-xs dark:border-cyan-500/40 dark:text-cyan-300">
                      Fortnite
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 border-t dark:border-white/15 border-blue-100">
                  <Button 
                    variant="ghost" 
                    className="w-full text-primary dark:text-blue-400 hover:bg-primary/10 dark:hover:bg-blue-500/20 group-hover:bg-gradient-to-r group-hover:from-blue-600/20 group-hover:to-cyan-600/20 transition-all duration-300"
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
          <div className="dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/10 bg-gray-50/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-2xl dark:shadow-blue-500/20 transform hover:scale-[1.02] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-blue-400/20 mb-4">
              <BookOpen className="h-8 w-8 text-primary dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
              {searchQuery ? "Aucun article trouvé" : "Aucun article publié"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? "Aucun article ne correspond à votre recherche. Essayez d'autres mots-clés."
                : "Les articles de blog seront bientôt disponibles. Revenez plus tard pour découvrir les dernières actualités !"
              }
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="border-primary text-primary hover:bg-primary/10 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/20 dark:bg-black/20 dark:backdrop-blur-xl"
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
