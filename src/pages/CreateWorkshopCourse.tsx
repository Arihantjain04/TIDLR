import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  GripVertical,
  Loader2,
  FileText,
  Link as LinkIcon,
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

export default function CreateWorkshopCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTag, setCurrentTag] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

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
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would normally send the data to your backend
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Workshop course created successfully!",
      });

      navigate("/admin/workshop");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workshop course. Please try again.",
        variant: "destructive",
      });
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
          </div>
        </div>
        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
          {resources.findIndex((r) => r.id === resource.id) + 1}
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
  };

  const removeResource = (id: number) => {
    setResources(resources.filter((resource) => resource.id !== id));
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
            id: resources.length + 1,
            type: "youtube",
            url: newResourceUrl,
            title: "Playlist Video 1",
            description: "Click to edit description",
          },
          {
            id: resources.length + 2,
            type: "youtube",
            url: newResourceUrl,
            title: "Playlist Video 2",
            description: "Click to edit description",
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Workshop Course
            </h1>
            <p className="text-muted-foreground">
              Add a new curated course to the workshop collection
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
                            {/* <FormDescription>
                              Display this course prominently
                            </FormDescription> */}
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

                    {/* <FormField
                      control={form.control}
                      name="numberOfResc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Resources</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

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
                            <Input
                              placeholder="Enter curator name"
                              {...field}
                            />
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
            <Card className="overflow-scroll h-[calc(40vh)] mt-6">
              <CardHeader>
                <CardTitle>Course Content ({resources.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/workshop")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
