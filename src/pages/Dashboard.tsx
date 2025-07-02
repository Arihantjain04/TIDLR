import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus, Clock, TrendingUp, Play, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  title: string;
  tags: string[];
  numberOfResc: number;
  lastOpened?: Date | string;
  completedResc: number;
  // Add other fields from your model as needed
}

interface FormattedCourse {
  id: string;
  title: string;
  progress: number;
  totalItems: number;
  completedResc: number;
  lastAccessed: string;
  category: string;
}

const Dashboard = () => {
  const [myCourses, setMyCourses] = useState<FormattedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  const getSupabaseToken = () => {
    const supabaseSession = localStorage.getItem(
      "sb-xxqoscilojosafuiwpxk-auth-token"
    );
    if (!supabaseSession) return null;

    try {
      const session = JSON.parse(supabaseSession);
      return session.access_token;
    } catch (error) {
      console.error("Error parsing Supabase session:", error);
      return null;
    }
  };

  const stats = [
    {
      label: "Courses in Progress",
      value: myCourses.length.toString(),
      icon: BookOpen,
    },
    { label: "Hours Learned", value: "47", icon: Clock },
    { label: "Completion Rate", value: "85%", icon: TrendingUp },
    { label: "Shared Courses", value: "2", icon: Users },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = getSupabaseToken();
        if (!token) {
          console.error("No Supabase token found");
          return;
        }

        const limit = showAll ? 0 : 3;

        const response = await axios.get<Course[]>(
          `${'https://tidlr-backend.onrender.com'}/v1/course/get-all-user-courses?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Fetched courses:", response.data);

        const formattedCourses = response.data.map(
          (course) =>
            ({
              id: course._id,
              title: course.title,
              progress: calculateProgress(course),
              totalItems: course.numberOfResc || 0,
              completedResc:
                course.completedResc ||
                Math.floor(
                  (calculateProgress(course) / 100) * (course.numberOfResc || 0)
                ),
              lastAccessed: formatLastAccessed(course.lastOpened),
              category: course.tags.length > 0 ? course.tags[0] : "General",
            } as FormattedCourse)
        ); // Explicitly type the object as FormattedCourse

        setMyCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [showAll]);

  const calculateProgress = (course: Course): number => {
    // Implement your actual progress calculation here
    // For now returning a random progress between 30-90%
    return Math.floor(course.completedResc / course.numberOfResc * 100);
    // return Math.floor(Math.random() * 60) + 30;
  };

  const formatLastAccessed = (date?: Date | string): string => {
    if (!date) return "Never accessed";

    const now = new Date();
    const lastOpened = new Date(date);
    const diffInMs = now.getTime() - lastOpened.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Continue your learning journey
            </p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* My Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All"}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-2 bg-gray-200 rounded w-full mt-2 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.category}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/course/${course.id}`, {
                            state: {
                              course 
                            },
                          })
                        }
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.completedResc/course.totalItems *100} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {course.completedResc}/{course.totalItems} items
                        </span>
                        <span>{course.lastAccessed}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
