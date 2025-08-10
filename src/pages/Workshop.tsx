import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCuratedCourses } from "@/lib/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";


const Workshop = () => {
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const { data: curatedCourses, isLoading } = useQuery({
    queryKey: ["curatedCourses"],
    queryFn: fetchCuratedCourses,
  });
  const [showAllCourses, setShowAllCourses] = useState(false);
  const initialCount = 3; ///initially visible

  const displayedCourses = showAllCourses
    ? curatedCourses
    : curatedCourses?.slice(0, initialCount);

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
        {curatedCourses?.some(course => course.isFeatured) && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Featured</h2>
              {curatedCourses.filter(course => course.isFeatured).length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllFeatured(prev => !prev)}
                >
                  {showAllFeatured ? "Show Less" : "See All"}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedCourses
                .filter(course => course.isFeatured)
                .slice(0, showAllFeatured ? undefined : 3) //only limits if not expanded
                .map((course) => (
                  <Card key={course._id} className="hover:shadow-lg transition-shadow">
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
                            by {course.curatorName}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.estimatedTime}h
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
                        <Link to={`/workshop/${course._id}`}>
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
          {/* title + show button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
            {curatedCourses?.length > initialCount && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllCourses((prev) => !prev)}
              >
                {showAllCourses ? "Show Less" : "See All"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses?.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        by {course.curatorName}
                      </p>
                    </div>
                    {course.isFeatured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.estimatedTime}h
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
                    <Link to={`/workshop/${course._id}`}>
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