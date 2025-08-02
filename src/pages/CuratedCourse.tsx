import { useQuery } from "@tanstack/react-query";
import { fetchCourseById, fetchCourseResources } from "@/lib/adminApi";
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


const CuratedCourse = () => {
  const { id } = useParams();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["curated-course", id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id,
  });

  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["curated-course-resources", id],
    queryFn: () => fetchCourseResources(id!),
    enabled: !!id,
  });

  const isLoading = courseLoading || resourcesLoading;

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
                  {course.isFeatured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                  <Badge variant="secondary">Curated Course</Badge>
                </div>
                <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    by {course.curatorName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {course.estimatedTime} hours
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
              <p className="text-muted-foreground">{course.description}</p>
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