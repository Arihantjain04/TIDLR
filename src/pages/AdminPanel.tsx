
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";

const AdminPanel = () => {
  // Mock admin check - you'll replace this with your backend logic
  const isAdmin = true;

  // Mock analytics data
  const analytics = {
    totalUsers: 1247,
    totalCourses: 89,
    curatedCourses: 6,
    activeUsers: 873
  };

  // Mock curated courses for management
  const curatedCourses = [
    {
      id: "1",
      title: "Complete React Development Path",
      intro: "This path was carefully curated to take you from React beginner to confident developer.",
      curator_name: "Sarah Chen",
      estimated_hours: 24,
      is_featured: true,
      is_published: true,
      created_at: "2024-01-15T00:00:00.000Z"
    },
    {
      id: "2",
      title: "Full-Stack TypeScript Mastery",
      intro: "TypeScript is essential for modern development. This curated path covers everything from basic types to advanced patterns.",
      curator_name: "Alex Rodriguez",
      estimated_hours: 18,
      is_featured: true,
      is_published: true,
      created_at: "2024-01-10T00:00:00.000Z"
    },
    {
      id: "3",
      title: "Modern CSS & Design Systems",
      intro: "Great design makes all the difference. This path teaches you to create stunning, accessible interfaces.",
      curator_name: "Emily Johnson",
      estimated_hours: 15,
      is_featured: false,
      is_published: false,
      created_at: "2024-01-08T00:00:00.000Z"
    }
  ];

  // Mock user courses for analytics
  const userCourses = [
    {
      id: "uc1",
      title: "Advanced JavaScript Patterns",
      description: "Deep dive into advanced JavaScript concepts and design patterns",
      is_public: true,
      tags: ["JavaScript", "Advanced"],
      created_at: "2024-01-12T00:00:00.000Z"
    },
    {
      id: "uc2",
      title: "Vue.js Complete Guide",
      description: "Learn Vue.js from basics to advanced topics with practical projects",
      is_public: false,
      tags: ["Vue.js", "Frontend"],
      created_at: "2024-01-11T00:00:00.000Z"
    },
    {
      id: "uc3",
      title: "Database Design Fundamentals",
      description: "Master database design principles and SQL optimization techniques",
      is_public: true,
      tags: ["Database", "SQL"],
      created_at: "2024-01-09T00:00:00.000Z"
    }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Access Denied</h3>
              <p className="text-sm">You don't have permission to access the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    { label: "Total Users", value: analytics?.totalUsers || 0, icon: Users },
    { label: "User Courses", value: analytics?.totalCourses || 0, icon: BookOpen },
    { label: "Curated Courses", value: analytics?.curatedCourses || 0, icon: Star },
    { label: "Active Users", value: analytics?.activeUsers || 0, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Manage content and monitor platform activity
            </p>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
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

        {/* Management Tabs */}
        <Tabs defaultValue="curated" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curated">Curated Courses</TabsTrigger>
            <TabsTrigger value="user-courses">User Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Curated Courses Management */}
          <TabsContent value="curated" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Curated Courses</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {curatedCourses?.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          {course.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">by {course.curator_name}</p>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{course.intro}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.estimated_hours}h
                          </div>
                          <span>Created {new Date(course.created_at!).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Courses Analytics */}
          <TabsContent value="user-courses" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">User Courses</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {userCourses?.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant={course.is_public ? "default" : "secondary"}>
                            {course.is_public ? "Public" : "Private"}
                          </Badge>
                          <span>Created {new Date(course.created_at!).toLocaleDateString()}</span>
                          {course.tags && course.tags.length > 0 && (
                            <div className="flex gap-1">
                              {course.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">User Management</h3>
                <p className="text-sm">Advanced user management features coming soon.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;