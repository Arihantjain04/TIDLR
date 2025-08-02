import { useQuery } from "@tanstack/react-query";
import { fetchUsers, fetchCuratedCourses, fetchAdminAnalytics, fetchUserCourses } from "@/lib/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  Star,
  Link
} from "lucide-react";
import Navigation from "@/components/Navigation";

const AdminPanel = () => {
  const isAdmin = true;

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAdminAnalytics
  });

  const { data: curatedCourses, isLoading: curatedCoursesLoading } = useQuery({
    queryKey: ["curatedCourses"],
    queryFn: fetchCuratedCourses
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });
  const { data: userCourses, isLoading: userCoursesLoading } = useQuery({
    queryKey: ["userCourses"],
    queryFn: fetchUserCourses,
  });
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
  const navigate = useNavigate();

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
              <Button onClick={() => navigate("/create-workshop-course")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {curatedCourses?.map((course) => (
                <Card key={course._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          {course.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {/* <Badge variant={course.is_Published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge> */}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">by {course.curatorName}</p>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.estimatedTime}h
                          </div>
                          <span>Created {new Date(course.createdAt!).toLocaleDateString()}</span>
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
                          <span>Created {new Date(course.createdAt!).toLocaleDateString()}</span>
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