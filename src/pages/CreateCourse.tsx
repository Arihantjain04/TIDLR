import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Link as LinkIcon,
  Youtube,
  FileText,
  X,
  GripVertical,
  Loader2,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const CreateCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const addResource = () => {
    if (newResourceUrl.trim()) {
      const newResource = {
        id: resources.length + 1,
        type: newResourceUrl.includes("youtube") ? "youtube" : "article",
        title: "New Resource",
        url: newResourceUrl,
        description: "Click to edit description",
      };
      setResources([...resources, newResource]);
      setNewResourceUrl("");
    }
  };

  const removeResource = (id: number) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const userSession = await supabase.auth.getSession();
      const token = userSession.data.session?.access_token;

      const payload = {
        title: courseTitle,
        description: courseDescription,
        tags,
        resources: resources.map((res, index) => ({
          url: res.url,
          typeOfResc: res.type,
          title: res.title,
          description: res.description,
          order: index + 1,
        })),
      };

      const response = await fetch(
        `${'https://tidlr-backend.onrender.com'}/v1/course/create-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create course");

      navigate(`/course/${data.course._id}`, {
        state: {
          course: data.course,
        },
      });
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Course</h1>
          <p className="text-muted-foreground mt-2">
            Build your structured learning journey from scattered resources
          </p>
        </div>

        <div className="space-y-8">
          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Development"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this course covers..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Add Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste YouTube link, article URL, or any resource..."
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addResource()}
                />
                <Button onClick={addResource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content ({resources.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource, index) => {
                  const Icon = getResourceIcon(resource.type);
                  return (
                    <div
                      key={resource.id}
                      className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {resource.url}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                        {index + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeResource(resource.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}

                {resources.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No resources added yet</p>
                    <p className="text-sm">
                      Start by adding your first learning resource above
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline">Save as Draft</Button>
            <div className="flex gap-3">
              <Button variant="outline">Preview Course</Button>
              <Button onClick={handlePublish} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Publishing..." : "Publish Course"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
