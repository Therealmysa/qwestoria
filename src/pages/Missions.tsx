
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
import { Textarea } from "@/components/ui/textarea";
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
    screenshot: null as File | null,
    missionId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionData({
        ...submissionData,
        screenshot: e.target.files[0],
      });
    }
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

      let screenshotUrl = null;

      // If there's a screenshot, upload it to Supabase Storage
      if (submissionData.screenshot) {
        const fileExt = submissionData.screenshot.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
        
        // This will need a storage bucket to be created first
        // const { data: uploadData, error: uploadError } = await supabase.storage
        //   .from('mission-submissions')
        //   .upload(fileName, submissionData.screenshot);

        // if (uploadError) throw uploadError;
        // screenshotUrl = `${supabaseUrl}/storage/v1/object/public/mission-submissions/${uploadData.path}`;
      }

      const { data, error } = await supabase
        .from('mission_submissions')
        .insert([
          { 
            mission_id: missionId,
            user_id: user!.id,
            fortnite_username: submissionData.fortniteUsername,
            screenshot_url: screenshotUrl,
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
        screenshot: null,
        missionId: "",
      });
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          onClick={() => setSubmissionData({
                            ...submissionData,
                            missionId: mission.id
                          })}
                          className="bg-[#9b87f5] hover:bg-[#8976e4]"
                        >
                          Submit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle>Submit Mission: {mission.title}</DialogTitle>
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
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="screenshot" className="text-right">
                              Screenshot
                            </Label>
                            <Input
                              id="screenshot"
                              name="screenshot"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="col-span-3 dark:bg-black/20 dark:border-white/15 bg-white/90"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            type="submit"
                            className="bg-[#9b87f5] hover:bg-[#8976e4] text-white"
                            disabled={isSubmitting || !submissionData.fortniteUsername}
                            onClick={() => handleSubmit(mission.id)}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Mission'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
      </div>
    </div>
  );
};

export default Missions;
