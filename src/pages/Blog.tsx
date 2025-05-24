
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
}

const Blog = () => {
  const { user } = useAuth();
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary dark:text-[#9b87f5]" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-[#9b87f5]">
            Blog d'Actualités
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez les dernières actualités, guides et conseils pour Fortnite
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-[#221F26] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="alphabetical">Alphabétique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-[#9b87f5]" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Chargement des articles...</span>
        </div>
      ) : getFilteredAndSortedPosts().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredAndSortedPosts().map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#221F26]">
              {post.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Clock className="h-4 w-4" />
                  <span>5 min de lecture</span>
                </div>
                <CardTitle className="text-xl text-gray-800 dark:text-white hover:text-primary dark:hover:text-[#9b87f5] transition-colors line-clamp-2">
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
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Article
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Fortnite
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 border-t border-gray-100 dark:border-gray-700">
                <Button 
                  variant="ghost" 
                  className="w-full text-primary dark:text-[#9b87f5] hover:bg-primary/10 dark:hover:bg-[#9b87f5]/20"
                  onClick={() => toast.info("Fonctionnalité de lecture d'article bientôt disponible")}
                >
                  Lire l'article
                  <Eye className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-[#9b87f5]/20 mb-4">
            <BookOpen className="h-8 w-8 text-primary dark:text-[#9b87f5]" />
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
              className="border-primary text-primary hover:bg-primary/10 dark:border-[#9b87f5] dark:text-[#9b87f5] dark:hover:bg-[#9b87f5]/20"
            >
              Effacer la recherche
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
