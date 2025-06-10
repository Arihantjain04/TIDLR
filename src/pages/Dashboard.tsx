
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus, Clock, TrendingUp, Play, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const myCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      progress: 65,
      totalItems: 12,
      completedItems: 8,
      lastAccessed: "2 hours ago",
      category: "Web Development",
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      progress: 30,
      totalItems: 15,
      completedItems: 5,
      lastAccessed: "1 day ago",
      category: "Design",
    },
    {
      id: 3,
      title: "JavaScript Advanced Concepts",
      progress: 90,
      totalItems: 8,
      completedItems: 7,
      lastAccessed: "3 days ago",
      category: "Programming",
    },
  ];

  const stats = [
    { label: "Courses in Progress", value: "3", icon: BookOpen },
    { label: "Hours Learned", value: "47", icon: Clock },
    { label: "Completion Rate", value: "85%", icon: TrendingUp },
    { label: "Shared Courses", value: "2", icon: Users },
  ];

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
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.category}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/course/${course.id}`}>
                        <Play className="h-4 w-4" />
                      </Link>
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
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{course.completedItems}/{course.totalItems} items</span>
                      <span>{course.lastAccessed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
