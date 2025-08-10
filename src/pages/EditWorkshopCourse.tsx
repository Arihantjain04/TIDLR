import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseById, fetchCourseResources } from "@/lib/adminApi";
import {
  ArrowLeft,
  Plus,
  X,
  GripVertical,
  Loader2,
  FileText,
  Link as LinkIcon,
  Save,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { Youtube } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isFeatured: z.boolean().default(false),
  whyCurated: z.string().min(1, "Why curated is required"),
  cover: z.any().optional(),
  tags: z.array(z.string()).optional().default([]),
  numberOfResc: z.number().min(0).optional().default(0),
  estimatedTime: z.number().min(1).optional(),
  curatorName: z.string().min(1, "Curator name is required"),
  curatorAvatar: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditWorkshopCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [currentTag, setCurrentTag] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesToDelete, setResourcesToDelete] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isFeatured: false,
      whyCurated: "",
      tags: [],
      numberOfResc: 0,
      curatorName: "",
      estimatedTime: 0,
    },
  });

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id,
  });

  // Fetch course resources
  const { data: courseResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["course-resources", id],
    queryFn: () => fetchCourseResources(id!),
    enabled: !!id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Pre-populate form when course data is loaded
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || "",
        description: course.description || "",
        isFeatured: course.isFeatured || false,
        whyCurated: course.whyCurated || "",
        tags: course.tags || [],
        numberOfResc: course.numberOfResc || 0,
        curatorName: course.curatorName || "",
        estimatedTime: course.estimatedTime || 0,
      });

      // Set image previews if they exist
      if (course.cover) {
        setCoverPreview(course.cover);
      }
      if (course.curatorAvatar) {
        setAvatarPreview(course.curatorAvatar);
      }
    }
  }, [course, form]);

  // Set resources when they're loaded
  useEffect(() => {
    if (courseResources && courseResources.length > 0) {
      const formattedResources = courseResources.filter(resource => resource.url && resource.url.trim() !== "").map((resource, index) => ({
        id: resource.id || index + 1,
        type: resource.type_of_resource === "video" ? "youtube" : resource.type_of_resource || "article",
        title: resource.title || "Untitled Resource",
        url: resource.url,
        description: resource.description || "",
        estimated_minutes: resource.estimated_minutes || 0,
      }));
      setResources(formattedResources);
    }
  }, [courseResources]);

  const onSubmit = async (data: FormData) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Course ID is missing.",
        variant: "destructive",
      });
      return;
    }
    // Validate resources before sending
    console.log('Resources before validation:', resources); // Debug log

    const invalidResources = resources.filter(resource =>
      !resource.url ||
      typeof resource.url !== 'string' ||
      resource.url.trim() === '' ||
      resource.url === 'undefined' ||
      resource.url === 'null'
    );

    if (invalidResources.length > 0) {
      console.error('Invalid resources found:', invalidResources);
      toast({
        title: "Validation Error",
        description: `${invalidResources.length} resource(s) have invalid URLs. Please check all resources have valid URLs.`,
        variant: "destructive",
      });
      return;
    }

    // Additional URL format validation
    const resourcesWithBadUrls = resources.filter(resource => {
      try {
        new URL(resource.url);
        return false; // URL is valid
      } catch {
        return true; // URL is invalid
      }
    });

    if (resourcesWithBadUrls.length > 0) {
      console.error('Resources with malformed URLs:', resourcesWithBadUrls);
      toast({
        title: "Validation Error",
        description: `${resourcesWithBadUrls.length} resource(s) have malformed URLs. Please enter valid URLs.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", data.title);
    formDataToSend.append("description", data.description);
    formDataToSend.append("isFeatured", data.isFeatured.toString());
    formDataToSend.append("whyCurated", data.whyCurated);
    formDataToSend.append("curatorName", data.curatorName);

    if (data.estimatedTime !== undefined && data.estimatedTime !== null) {
      formDataToSend.append("estimatedTime", data.estimatedTime.toString());
    }

    // Only append files if they're actual File objects (new uploads)
    if (data.cover && data.cover instanceof File) {
      formDataToSend.append("cover", data.cover);
    }
    if (data.curatorAvatar && data.curatorAvatar instanceof File) {
      formDataToSend.append("curatorAvatar", data.curatorAvatar);
    }


    // Validate JSON serialization before sending
    try {
      const resourcesJson = JSON.stringify(resources);
      const tagsJson = JSON.stringify(data.tags || []);

      console.log('Resources JSON to be sent:', resourcesJson); // Debug log

      formDataToSend.append("resources", resourcesJson);
      formDataToSend.append("tags", tagsJson);
      formDataToSend.append("numberOfResc", data.numberOfResc?.toString() || "0");
      formDataToSend.append("removedResources", JSON.stringify(resourcesToDelete));

    } catch (jsonError) {
      console.error('JSON serialization error:', jsonError);
      toast({
        title: "Error",
        description: "Failed to process resource data. Please check all fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://localhost:8000/v1/workshop/${id}`, {
        method: "PUT",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      console.log('Response status:', response.status);
      console.log('Response result:', result);

      if (!response.ok) {
        throw new Error(result.error || "Workshop course update failed.");
      }
      setResourcesToDelete([]);
      toast({
        title: "Success",
        description: "Workshop course updated successfully!",
      });

      navigate("/admin/workshop");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update workshop course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(currentTag.trim())) {
        form.setValue("tags", [...currentTags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cover" | "curatorAvatar"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for now
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      form.setValue(field, file);
      const reader = new FileReader();
      reader.onload = () => {
        if (field === "cover") {
          setCoverPreview(reader.result as string);
        } else {
          setAvatarPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const SortableItem = ({ resource }: { resource: any }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedResource, setEditedResource] = useState(resource);

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: resource.id });

    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
    };

    const Icon =
      resource.type === "youtube"
        ? Youtube
        : resource.type === "article"
          ? FileText
          : LinkIcon;

    const handleSave = () => {
      setResources(resources.map(r =>
        r.id === resource.id ? editedResource : r
      ));
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditedResource(resource);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="p-4 border border-border rounded-lg bg-card space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Editing Resource #{resources.findIndex((r) => r.id === resource.id) + 1}</span>
          </div>

          <div className="space-y-3 pl-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={editedResource.title}
                onChange={(e) => setEditedResource({ ...editedResource, title: e.target.value })}
                placeholder="Resource title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">URL</label>
              <Input
                value={editedResource.url}
                onChange={(e) => setEditedResource({ ...editedResource, url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={editedResource.description || ""}
                onChange={(e) => setEditedResource({ ...editedResource, description: e.target.value })}
                placeholder="Brief description of the resource"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  value={editedResource.type}
                  onChange={(e) => setEditedResource({ ...editedResource, type: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                >
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="youtube">YouTube</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Duration (min)</label>
                <Input
                  type="number"
                  min="0"
                  value={editedResource.estimated_minutes || ""}
                  onChange={(e) => setEditedResource({ ...editedResource, estimated_minutes: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{resource.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {resource.url}
            </p>
            {resource.description && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {resource.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {resource.estimated_minutes > 0 && (
            <Badge variant="outline" className="text-xs">
              {resource.estimated_minutes}m
            </Badge>
          )}
          <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
            {resources.findIndex((r) => r.id === resource.id) + 1}
          </span>
          {/* <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            Edit
          </Button> */}
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => removeResource(resource.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const removeResource = (id: string) => {
     // hide from UI
  setResources(prev => prev.filter(r => (r._id ?? r.id) !== id));
    // mark for deletion
    setResourcesToDelete(prev => [...prev, id]);
};

  const addResource = async () => {
    if (!newResourceUrl.trim()) return;

    const isPlaylist = newResourceUrl.includes("list=");

    if (isPlaylist) {
      setPlaylistLoading(true);
      try {
        // Simulate playlist expansion
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newResources = [
          {
            id: Date.now() + 1,
            type: "youtube",
            url: newResourceUrl,
            title: "Playlist Video 1",
            description: "Click edit to update description",
            estimated_minutes: 0,
          },
          {
            id: Date.now() + 2,
            type: "youtube",
            url: newResourceUrl,
            title: "Playlist Video 2",
            description: "Click edit to update description",
            estimated_minutes: 0,
          },
        ];
        setResources([...resources, ...newResources]);
        setNewResourceUrl("");
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to add playlist",
          variant: "destructive",
        });
      } finally {
        setPlaylistLoading(false);
      }
    } else {
      const newResource = {
        id: Date.now(),
        type: newResourceUrl.includes("youtube") ? "youtube" : "video",
        title: "New Resource",
        url: newResourceUrl,
        description: "Click edit to update description",
        estimated_minutes: 0,
      };
      setResources([...resources, newResource]);
      setNewResourceUrl("");
    }
  };

  // Loading state
  if (courseLoading || resourcesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Course not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This course may not exist or you don't have permission to edit it.
            </p>
            <Button asChild variant="outline">
              <span onClick={() => navigate("/admin/workshop")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workshop
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/workshop")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Workshop Course
            </h1>
            <p className="text-muted-foreground">
              Update the curated course information and resources
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter course title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the course content and objectives"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whyCurated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why Curated *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain why this course was selected and curated"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide insights on the course quality and selection
                            criteria
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cover"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Cover Image</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "cover")}
                                className="cursor-pointer"
                              />
                              {coverPreview && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                  <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => {
                                      setCoverPreview(null);
                                      form.setValue("cover", undefined);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Featured Course
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time (minutes)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                min="1"
                                placeholder="60"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                mins
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("tags")?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Curator Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="curatorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curator Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter curator name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="curatorAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curator Avatar</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "curatorAvatar")
                            }
                            className="cursor-pointer"
                          />
                          {avatarPreview && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-1 -right-1 h-6 w-6"
                                onClick={() => {
                                  setAvatarPreview(null);
                                  form.setValue("curatorAvatar", undefined);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Add Resources */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Add Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Paste YouTube link, playlist, article URL, etc."
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addResource()}
                  />
                  <Button onClick={addResource} disabled={playlistLoading}>
                    {playlistLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding playlist...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Course Content ({resources.length} items)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Drag to reorder resources. Click "Edit" to modify resource details.
                </p>
              </CardHeader>
              <CardContent className="max-h-[50vh] overflow-y-auto">
                {resources.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={({ active, over }) => {
                      if (active.id !== over?.id) {
                        const oldIndex = resources.findIndex(
                          (r) => r.id === active.id
                        );
                        const newIndex = resources.findIndex(
                          (r) => r.id === over?.id
                        );
                        setResources((items) =>
                          arrayMove(items, oldIndex, newIndex)
                        );
                      }
                    }}
                  >
                    <SortableContext
                      items={resources.map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {resources.map((resource) => (
                          <SortableItem key={resource.id} resource={resource} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No resources added yet</p>
                    <p className="text-sm">Add your first resource above</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/workshop")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}