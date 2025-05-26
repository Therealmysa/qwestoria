
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Clock, Coins } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  external_link: string | null;
  starts_at: string;
  ends_at: string | null;
}

const Missions = () => {
  const { user, profile, loading } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState({
    fortniteUsername: profile?.fortnite_username || "",
    screenshotUrl: "",
    missionId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else {
      fetchMissions();
    }
  }, [user, loading, navigate]);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMissions(data as Mission[]);
    } catch (error: any) {
      console.error("Error fetching missions:", error.message);
      toast({
        title: "Error",
        description: "Failed to load missions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (url: string) => {
    setSubmissionData({
      ...submissionData,
      screenshotUrl: url,
    });
  };

  const uploadToSupabaseStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('temp')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('temp')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (missionId: string) => {
    if (!submissionData.fortniteUsername) {
      toast({
        title: "Error",
        description: "Fortnite username is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if user already has a pending submission for this mission
      const { data: existingSubmission } = await supabase
        .from('mission_submissions')
        .select('id')
        .eq('mission_id', missionId)
        .eq('user_id', user!.id)
        .eq('status', 'pending')
        .single();

      if (existingSubmission) {
        toast({
          title: "Error",
          description: "You already have a pending submission for this mission.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('mission_submissions')
        .insert([
          { 
            mission_id: missionId,
            user_id: user!.id,
            fortnite_username: submissionData.fortniteUsername,
            screenshot_url: submissionData.screenshotUrl || null,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your mission submission has been received and is pending validation.",
      });

      // Reset submission data
      setSubmissionData({
        fortniteUsername: profile?.fortnite_username || "",
        screenshotUrl: "",
        missionId: "",
      });
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error submitting mission:', error.message);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = (mission: Mission) => {
    const now = new Date();
    const startDate = new Date(mission.starts_at);
    const endDate = mission.ends_at ? new Date(mission.ends_at) : null;
    
    return startDate <= now && (!endDate || endDate > now);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const openSubmissionDialog = (missionId: string) => {
    setSubmissionData({
      ...submissionData,
      missionId: missionId,
    });
    setShowDialog(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gradient-modern">Missions</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#9b87f5] rounded-full"></div>
          </div>
        ) : missions.length === 0 ? (
          <p className="text-center text-lg text-gray-400 dark:text-gray-400">No missions available at the moment.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <Card key={mission.id} className={`border-${isActive(mission) ? '[#9b87f5]' : 'gray'}/50 dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 text-gray-900 dark:text-white overflow-hidden`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gradient-modern truncate">
                      {mission.title}
                    </CardTitle>
                    {mission.is_vip_only && (
                      <Badge className="bg-amber-500/80 text-black">VIP</Badge>
                    )}
                  </div>
                  <CardDescription className="dark:text-gray-400">
                    {mission.starts_at && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDate(mission.starts_at)} 
                          {mission.ends_at && ` - ${formatDate(mission.ends_at)}`}
                        </span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm dark:text-gray-300">{mission.description}</p>
                  <div className="flex items-center mt-4">
                    <Coins className="h-5 w-5 text-amber-400 mr-1" />
                    <span className="font-bold text-amber-400">{mission.reward_coins} BradCoins</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  {mission.external_link && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(mission.external_link!, '_blank')}
                      className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                  )}
                  
                  {isActive(mission) && !mission.is_vip_only || (mission.is_vip_only && profile?.is_vip) ? (
                    <Button 
                      size="sm" 
                      onClick={() => openSubmissionDialog(mission.id)}
                      className="bg-[#9b87f5] hover:bg-[#8976e4]"
                    >
                      Submit
                    </Button>
                  ) : mission.is_vip_only && !profile?.is_vip ? (
                    <Button 
                      size="sm" 
                      disabled
                      className="bg-gray-700 text-gray-400 cursor-not-allowed"
                    >
                      VIP Only
                    </Button>
                  ) : !isActive(mission) ? (
                    <Button 
                      size="sm" 
                      disabled
                      className="bg-gray-700 text-gray-400 cursor-not-allowed"
                    >
                      Inactive
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle>Submit Mission</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Fill out the details to submit your completed mission.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fortniteUsername" className="text-right">
                  Fortnite Username
                </Label>
                <Input
                  id="fortniteUsername"
                  name="fortniteUsername"
                  value={submissionData.fortniteUsername}
                  onChange={handleSubmissionChange}
                  className="col-span-3 dark:bg-black/20 dark:border-white/15 bg-white/90"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Screenshot
                </Label>
                <div className="col-span-3">
                  <FileUpload
                    onUploadComplete={handleFileUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    maxSizeMB={10}
                    buttonText="Upload proof"
                    secureUpload={false}
                  />
                  {submissionData.screenshotUrl && (
                    <p className="text-sm text-green-600 mt-2">File uploaded successfully!</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit"
                className="bg-[#9b87f5] hover:bg-[#8976e4] text-white"
                disabled={isSubmitting || !submissionData.fortniteUsername}
                onClick={() => handleSubmit(submissionData.missionId)}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Mission'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Missions;
