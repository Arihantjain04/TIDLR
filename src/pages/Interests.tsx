
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

const AVAILABLE_INTERESTS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Digital Marketing",
  "Photography",
  "Video Editing",
  "Business Strategy",
  "Project Management",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Game Development",
  "3D Modeling",
  "Graphic Design",
  "Writing & Content",
  "Public Speaking",
  "Finance & Investing",
  "Language Learning",
  "Music Production",
  "Cooking & Culinary Arts",
];

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user already has interests set
      const { data: userData } = await supabase
        .from("user")
        .select("interests")
        .eq("email", session.user.email)
        .single();

      if (userData?.interests && userData.interests.length >= 3) {
        navigate("/dashboard");
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      toast({
        title: "Please select at least 3 interests",
        description: "This helps us personalize your learning experience.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists in our custom user table
      const { data: existingUser } = await supabase
        .from("user")
        .select("id")
        .eq("email", user.email)
        .single();

      if (existingUser) {
        // Update existing user
        const { error } = await supabase
          .from("user")
          .update({
            interests: selectedInterests,
          })
          .eq("email", user.email);

        if (error) throw error;
      } else {
        // Create new user record
        const { error } = await supabase
          .from("user")
          .insert({
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email,
            password: "", // We don't store passwords in our table, Supabase Auth handles this
            interests: selectedInterests,
            avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
            xp: 0,
            level: 1,
            badges: [],
          });

        if (error) throw error;
      }

      toast({
        title: "Interests saved!",
        description: "Welcome to Tidlr! Let's start learning.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving interests:", error);
      toast({
        title: "Error saving interests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            What are you interested in learning?
          </CardTitle>
          <p className="text-muted-foreground">
            Select at least 3 topics to personalize your experience. You can always change these later.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_INTERESTS.map((interest) => (
              <div
                key={interest}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleInterestToggle(interest)}
              >
                <Checkbox
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                <label className="text-sm font-medium cursor-pointer flex-1">
                  {interest}
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Selected: {selectedInterests.length} / {AVAILABLE_INTERESTS.length}
              {selectedInterests.length < 3 && (
                <span className="text-destructive ml-2">
                  (At least 3 required)
                </span>
              )}
            </p>

            <Button
              onClick={handleSubmit}
              disabled={selectedInterests.length < 3 || loading}
              className="w-full max-w-md"
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Interests;
