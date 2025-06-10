
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  CheckCircle, 
  Circle, 
  Clock, 
  Users, 
  BookOpen,
  Youtube,
  FileText,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight,
  Share,
  Bookmark
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Course = () => {
  const { id } = useParams();
  const [currentResource, setCurrentResource] = useState(0);

  // Mock course data - in real app this would come from API
  const course = {
    id: 1,
    title: "Complete React Development",
    description: "Master React from fundamentals to advanced concepts with this comprehensive course built from curated online resources.",
    author: "John Doe",
    tags: ["React", "JavaScript", "Web Development", "Frontend"],
    totalItems: 12,
    completedItems: 8,
    progress: 67,
    duration: "6 hours",
    students: 245,
    resources: [
      {
        id: 1,
        type: "youtube",
        title: "React Fundamentals Introduction",
        url: "https://youtube.com/watch?v=example1",
        duration: "25 min",
        completed: true,
        description: "Learn the basic concepts of React including components, JSX, and props."
      },
      {
        id: 2,
        type: "article",
        title: "Understanding React Hooks",
        url: "https://example.com/react-hooks",
        duration: "15 min read",
        completed: true,
        description: "Deep dive into useState, useEffect, and custom hooks."
      },
      {
        id: 3,
        type: "youtube",
        title: "Building Your First React App",
        url: "https://youtube.com/watch?v=example2",
        duration: "45 min",
        completed: true,
        description: "Step-by-step tutorial for creating a complete React application."
      },
      {
        id: 4,
        type: "article",
        title: "React State Management",
        url: "https://example.com/state-management",
        duration: "20 min read",
        completed: false,
        description: "Learn about different state management solutions in React."
      },
      {
        id: 5,
        type: "youtube",
        title: "Advanced React Patterns",
        url: "https://youtube.com/watch?v=example3",
        duration: "35 min",
        completed: false,
        description: "Explore advanced patterns like render props and higher-order components."
      },
    ]
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return Youtube;
      case "article":
        return FileText;
      default:
        return LinkIcon;
    }
  };

  const toggleResourceComplete = (resourceId: number) => {
    // In real app, this would update the backend
    console.log(`Toggling completion for resource ${resourceId}`);
  };

  const currentResourceData = course.resources[currentResource];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span>Courses</span>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalItems} resources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.students} students</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{course.progress}% Complete</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {course.completedItems} of {course.totalItems} resources completed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = getResourceIcon(currentResourceData.type);
                      return <Icon className="h-5 w-5" />;
                    })()}
                    {currentResourceData.title}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant={currentResourceData.completed ? "default" : "outline"}
                    onClick={() => toggleResourceComplete(currentResourceData.id)}
                  >
                    {currentResourceData.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{currentResourceData.description}</p>
                  
                  {/* Embedded Content Area */}
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      {(() => {
                        const Icon = getResourceIcon(currentResourceData.type);
                        return <Icon className="h-8 w-8" />;
                      })()}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentResourceData.type === "youtube" ? "Video content would be embedded here" : "Article content would be embedded here"}
                    </p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      {currentResourceData.type === "youtube" ? "Play Video" : "Read Article"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Duration: {currentResourceData.duration}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentResource === 0}
                        onClick={() => setCurrentResource(currentResource - 1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        disabled={currentResource === course.resources.length - 1}
                        onClick={() => setCurrentResource(currentResource + 1)}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Outline Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Outline</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {course.resources.map((resource, index) => {
                    const Icon = getResourceIcon(resource.type);
                    const isActive = index === currentResource;
                    
                    return (
                      <button
                        key={resource.id}
                        onClick={() => setCurrentResource(index)}
                        className={`w-full text-left p-4 hover:bg-accent transition-colors border-l-2 ${
                          isActive 
                            ? "border-primary bg-accent/50" 
                            : resource.completed 
                            ? "border-green-500" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {resource.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium truncate">
                                {resource.title}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {resource.duration}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
