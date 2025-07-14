
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Play, 
  ExternalLink,
  Star,
  CheckCircle,
  FileText,
  Video
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

// Dummy course data
const dummyCourses = [
  {
    id: "1",
    title: "Complete React Development Path",
    description: "Master React from basics to advanced concepts including hooks, context, and modern patterns. This comprehensive path covers everything you need to become a confident React developer.",
    intro: "This path was carefully curated to take you from React beginner to confident developer. Each resource builds upon the previous one, ensuring a smooth learning progression without overwhelming complexity.",
    curator_name: "Sarah Chen",
    estimated_hours: 24,
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    is_featured: true,
    is_published: true
  },
  {
    id: "2",
    title: "Full-Stack TypeScript Mastery",
    description: "Learn TypeScript for both frontend and backend development with practical projects and real-world examples.",
    intro: "TypeScript is essential for modern development. This curated path covers everything from basic types to advanced patterns used in production applications.",
    curator_name: "Alex Rodriguez",
    estimated_hours: 18,
    tags: ["TypeScript", "Node.js", "Full-Stack"],
    is_featured: true,
    is_published: true
  }
];

// Dummy resources data
const dummyResources = {
  "1": [
    {
      id: "r1",
      course_id: "1",
      title: "React Fundamentals & JSX",
      url: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
      type_of_resource: "video",
      description: "Learn the basics of React, components, and JSX syntax. Perfect starting point for beginners.",
      sort_order: 1,
      estimated_minutes: 45
    },
    {
      id: "r2",
      course_id: "1",
      title: "Understanding React Hooks",
      url: "https://react.dev/reference/react",
      type_of_resource: "article",
      description: "Deep dive into useState, useEffect, and custom hooks with practical examples.",
      sort_order: 2,
      estimated_minutes: 60
    },
    {
      id: "r3",
      course_id: "1",
      title: "State Management with Context API",
      url: "https://www.youtube.com/watch?v=35lXWvCuM8o",
      type_of_resource: "video",
      description: "Learn how to manage global state in React applications using Context API.",
      sort_order: 3,
      estimated_minutes: 40
    },
    {
      id: "r4",
      course_id: "1",
      title: "Building Your First React Project",
      url: "https://github.com/facebook/create-react-app",
      type_of_resource: "tutorial",
      description: "Step-by-step guide to building a complete React application from scratch.",
      sort_order: 4,
      estimated_minutes: 120
    },
    {
      id: "r5",
      course_id: "1",
      title: "React Performance Optimization",
      url: "https://react.dev/learn/render-and-commit",
      type_of_resource: "article",
      description: "Advanced techniques for optimizing React app performance and avoiding common pitfalls.",
      sort_order: 5,
      estimated_minutes: 50
    }
  ],
  "2": [
    {
      id: "r6",
      course_id: "2",
      title: "TypeScript Basics & Type System",
      url: "https://www.typescriptlang.org/docs/",
      type_of_resource: "article",
      description: "Understanding TypeScript's type system, interfaces, and basic type annotations.",
      sort_order: 1,
      estimated_minutes: 40
    },
    {
      id: "r7",
      course_id: "2",
      title: "Advanced TypeScript Patterns",
      url: "https://www.youtube.com/watch?v=hBk4nV7q6-w",
      type_of_resource: "video",
      description: "Generics, utility types, and advanced patterns for scalable TypeScript code.",
      sort_order: 2,
      estimated_minutes: 55
    },
    {
      id: "r8",
      course_id: "2",
      title: "TypeScript with Node.js & Express",
      url: "https://nodejs.org/en/docs/",
      type_of_resource: "tutorial",
      description: "Building robust backend APIs with TypeScript, Node.js, and Express framework.",
      sort_order: 3,
      estimated_minutes: 90
    }
  ]
};

const CuratedCourse = () => {
  const { id } = useParams();
  
  const course = dummyCourses.find(c => c.id === id);
  const resources = dummyResources[id as keyof typeof dummyResources] || [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Course not found</h3>
            <p className="text-sm text-muted-foreground mb-4">This course may not exist or is not published.</p>
            <Button asChild variant="outline">
              <Link to="/workshop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workshop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return Video;
      case 'article':
        return FileText;
      case 'tutorial':
        return Play;
      default:
        return ExternalLink;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/workshop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workshop
          </Link>
        </Button>

        {/* Course Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {course.is_featured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                  <Badge variant="secondary">Curated Course</Badge>
                </div>
                <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    by {course.curator_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {course.estimated_hours} hours
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {resources?.length || 0} resources
                  </div>
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Why this course was curated:</h4>
              <p className="text-muted-foreground">{course.intro}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Learning Path</h2>
          
          <div className="space-y-4">
            {resources?.map((resource, index) => {
              const ResourceIcon = getResourceIcon(resource.type_of_resource);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                            {resource.description && (
                              <p className="text-muted-foreground mb-3">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {resource.type_of_resource}
                              </Badge>
                              {resource.estimated_minutes && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {resource.estimated_minutes} min
                                </div>
                              )}
                            </div>
                          </div>
                          <Button asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ResourceIcon className="h-4 w-4 mr-2" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {(!resources || resources.length === 0) && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No resources yet</h3>
                <p className="text-sm">This course is still being prepared.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuratedCourse;