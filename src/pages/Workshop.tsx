
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

// Dummy data for workshop courses
const dummyCourses = [
  {
    id: "1",
    title: "Complete React Development Path",
    description: "Master React from basics to advanced concepts including hooks, context, and modern patterns",
    intro: "This path was carefully curated to take you from React beginner to confident developer. Each resource builds upon the previous one, ensuring a smooth learning progression.",
    curator_name: "Sarah Chen",
    estimated_hours: 24,
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    is_featured: true,
    is_published: true
  },
  {
    id: "2",
    title: "Full-Stack TypeScript Mastery",
    description: "Learn TypeScript for both frontend and backend development with practical projects",
    intro: "TypeScript is essential for modern development. This curated path covers everything from basic types to advanced patterns used in production applications.",
    curator_name: "Alex Rodriguez",
    estimated_hours: 18,
    tags: ["TypeScript", "Node.js", "Full-Stack"],
    is_featured: true,
    is_published: true
  },
  {
    id: "3",
    title: "Modern CSS & Design Systems",
    description: "Build beautiful, responsive interfaces with modern CSS techniques and design principles",
    intro: "Great design makes all the difference. This path teaches you to create stunning, accessible interfaces that users love.",
    curator_name: "Emily Johnson",
    estimated_hours: 15,
    tags: ["CSS", "Design", "UI/UX", "Responsive"],
    is_featured: false,
    is_published: true
  },
  {
    id: "4",
    title: "Python for Data Science",
    description: "Learn Python, pandas, NumPy, and data visualization for data analysis and machine learning",
    intro: "Data science is the future. This carefully selected collection of resources will get you from Python basics to analyzing real datasets.",
    curator_name: "Dr. Michael Park",
    estimated_hours: 32,
    tags: ["Python", "Data Science", "Machine Learning", "Analytics"],
    is_featured: false,
    is_published: true
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable applications using AWS services and best practices",
    intro: "Cloud computing is everywhere. This path covers the most important AWS services and architectural patterns used by top companies.",
    curator_name: "David Kumar",
    estimated_hours: 28,
    tags: ["AWS", "Cloud", "DevOps", "Architecture"],
    is_featured: false,
    is_published: true
  },
  {
    id: "6",
    title: "Mobile Development with React Native",
    description: "Build cross-platform mobile apps using React Native and modern mobile development practices",
    intro: "One codebase, two platforms. This path teaches you to build professional mobile apps that work on both iOS and Android.",
    curator_name: "Jessica Liu",
    estimated_hours: 22,
    tags: ["React Native", "Mobile", "iOS", "Android"],
    is_featured: false,
    is_published: true
  }
];

const Workshop = () => {
  const curatedCourses = dummyCourses;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Workshop</h1>
          <p className="text-muted-foreground mt-2">
            Expertly curated learning paths ready to start
          </p>
        </div>

        {/* Featured Courses */}
        {curatedCourses?.some(course => course.is_featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {curatedCourses
                .filter(course => course.is_featured)
                .slice(0, 2)
                .map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <Badge variant="secondary">Featured</Badge>
                          </div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            by {course.curator_name}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {course.intro}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.estimated_hours}h
                        </div>
                      </div>

                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button asChild className="w-full">
                        <Link to={`/workshop/${course.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedCourses?.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        by {course.curator_name}
                      </p>
                    </div>
                    {course.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.intro}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.estimated_hours}h
                    </div>
                  </div>

                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button asChild size="sm" className="w-full">
                    <Link to={`/workshop/${course.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!curatedCourses || curatedCourses.length === 0) && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="text-sm">Check back soon for expertly curated learning paths.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workshop;