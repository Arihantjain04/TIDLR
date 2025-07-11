import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import { serverurl } from "../../urls.json";

const EditCourse = () => {
    const { id: courseId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [newResourceUrl, setNewResourceUrl] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (!state?.course) return;

        const course = state.course;
        setCourseTitle(course.title || "");
        setCourseDescription(course.description || "");
        setTags(course.tags || []);

        fetch(`${serverurl}/v1/course/get-all-resc/${courseId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("sb-xxqoscilojosafuiwpxk-auth-token") || '{}').access_token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const enriched = data.resources.map((r, i) => ({
                    id: r._id,
                    title: r.title,
                    description: r.description || "Click to edit description",
                    url: r.url,
                    type: r.url.includes("youtube") ? "youtube" : "article",
                }));
                setResources(enriched);
            });
    }, [courseId, state]);

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

    const SortableItem = ({ resource }: { resource: any }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: resource.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const Icon = getResourceIcon(resource.type);

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
                        <p className="text-xs text-muted-foreground truncate">{resource.url}</p>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                    {resources.findIndex((r) => r.id === resource.id) + 1}
                </span>
                <Button size="sm" variant="ghost" onClick={() => removeResource(resource.id)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const removeResource = (id: string) => {
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

    const addResource = async () => {
  if (!newResourceUrl.trim()) return;

  const isPlaylist = newResourceUrl.includes("list=");

  if (isPlaylist) {
    setPlaylistLoading(true);
    try {
      const userSession = await supabase.auth.getSession();
      const token = userSession.data.session?.access_token;

      const response = await fetch(`${serverurl}/v1/course/expand-playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: newResourceUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to expand playlist");

      const newResources = data.videos.map((vid: any, i: number) => ({
        id: `${Date.now()}-${i}`, // temp unique id
        type: "youtube",
        url: vid.url,
        title: vid.title,
        description: vid.description || "Click to edit description",
      }));

      setResources([...resources, ...newResources]);
      setNewResourceUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to add playlist");
    } finally {
      setPlaylistLoading(false);
    }
  } else {
    const newResource = {
      id: `${Date.now()}`, // temp unique id
      type: newResourceUrl.includes("youtube") ? "youtube" : "article",
      title: "New Resource",
      url: newResourceUrl,
      description: "Click to edit description",
    };
    setResources([...resources, newResource]);
    setNewResourceUrl("");
  }
};


    const handleSave = async () => {
        setLoading(true);
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;
            const payload = {
      title: courseTitle,
      description: courseDescription,
      tags,
      resources: resources.map((r, index) => ({
        id: r.id,
        url: r.url,
        typeOfResc: r.type,
        title: r.title,
        description: r.description,
        order: index,
      })),
    };
            await fetch(`${serverurl}/v1/course/update-course/${courseId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
                    <p className="text-muted-foreground mt-2">
                        Make changes to your course
                    </p>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
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
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addTag()}
                                        placeholder="Add a tag"
                                    />
                                    <Button onClick={addTag} variant="outline" size="sm">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Add More Resources</CardTitle>
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
                                            Adding...
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content ({resources.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={({ active, over }) => {
                                    if (active.id !== over?.id) {
                                        const oldIndex = resources.findIndex((r) => r.id === active.id);
                                        const newIndex = resources.findIndex((r) => r.id === over?.id);
                                        setResources((items) => arrayMove(items, oldIndex, newIndex));
                                    }
                                }}
                            >
                                <SortableContext items={resources.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {resources.map((resource) => (
                                            <SortableItem key={resource.id} resource={resource} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
