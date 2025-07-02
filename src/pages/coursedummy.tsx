import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    class Player {
      constructor(id: string | HTMLElement, options: PlayerOptions);
      getDuration(): number;
      getCurrentTime(): number;
      destroy(): void;
    }

    interface PlayerOptions {
      videoId: string;
      events?: {
        onReady?: (event: any) => void;
        onStateChange?: (event: any) => void;
      };
    }
  }
}

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
  Bookmark,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Course = () => {
  const { id } = useParams();
  const [currentResource, setCurrentResource] = useState(0);
  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [pendingCompletions, setPendingCompletions] = useState<
    Record<number, boolean>
  >({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const course = {
    id: 1,
    title: "Complete React Development",
    description:
      "Master React from fundamentals to advanced concepts with this comprehensive course built from curated online resources.",
    author: "John Doe",
    tags: ["React", "JavaScript", "Web Development", "Frontend"],
    resources: [
      {
        id: 1,
        type: "youtube",
        title: "React Fundamentals Introduction",
        url: "https://youtu.be/bGTxID65Mm4",
        duration: "25 min",
        completed: true,
        description:
          "Learn the basic concepts of React including components, JSX, and props.",
      },
      {
        id: 2,
        type: "article",
        title: "Understanding React Hooks",
        url: "https://www.youtube.com/watch?v=bz3zyz9c8Jw&pp=0gcJCd4JAYcqIYzv",
        duration: "15 min read",
        completed: true,
        description: "Deep dive into useState, useEffect, and custom hooks.",
      },
      {
        id: 3,
        type: "youtube",
        title: "Building Your First React App",
        url: "https://www.youtube.com/watch?v=SJC32rbdbE4",
        duration: "45 min",
        completed: true,
        description:
          "Step-by-step tutorial for creating a complete React application.",
      },
      {
        id: 4,
        type: "article",
        title: "React State Management",
        url: "https://example.com/state-management",
        duration: "20 min read",
        completed: false,
        description:
          "Learn about different state management solutions in React.",
      },
      {
        id: 5,
        type: "youtube",
        title: "Advanced React Patterns",
        url: "https://www.youtube.com/watch?v=5eiTIc5rG9w",
        duration: "35 min",
        completed: false,
        description:
          "Explore advanced patterns like render props and higher-order components.",
      },
    ],
  };

  const [completedResources, setCompletedResources] = useState<
    Record<number, boolean>
  >(
    course.resources.reduce((acc, resource) => {
      acc[resource.id] = resource.completed || false;
      return acc;
    }, {} as Record<number, boolean>)
  );

  const completedCount =
    Object.values(completedResources).filter(Boolean).length;
  const progress = Math.round((completedCount / course.resources.length) * 100);

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

  const toggleResourceComplete = async (resourceId: number) => {
    const newStatus = !completedResources[resourceId];

    setCompletedResources((prev) => ({
      ...prev,
      [resourceId]: newStatus,
    }));

    setPendingCompletions((prev) => ({
      ...prev,
      [resourceId]: newStatus,
    }));
  };

  const saveCompletionsToBackend = async () => {
    if (isSaving || Object.keys(pendingCompletions).length === 0) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving completions:", pendingCompletions);

      setLastSaved(new Date());
      setPendingCompletions({});
    } catch (error) {
      console.error("Failed to save completions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(pendingCompletions).length > 0) {
        saveCompletionsToBackend();
      }
    }, 30000);

    return () => {
      clearInterval(saveInterval);
      if (Object.keys(pendingCompletions).length > 0) {
        saveCompletionsToBackend();
      }
    };
  }, [pendingCompletions]);

  const currentResourceData = course.resources[currentResource];
  const currentId = currentResourceData.id;

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: notes[currentId] || "",
    onUpdate: ({ editor }) => {
      setNotes((prev) => ({ ...prev, [currentId]: editor.getHTML() }));
    },
    editable: notesVisible,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(notesVisible);
    }
  }, [notesVisible, editor]);

  const onSaveNotes = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    console.log("Saving notes:", html);
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      } else if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (currentResourceData.type !== "youtube") return;

    let player: YT.Player | null = null;
    let interval: ReturnType<typeof setInterval>;

    const videoId = getYouTubeVideoId(currentResourceData.url);
    if (!videoId) return;

    const createPlayer = () => {
      player = new YT.Player("youtube-player", {
        videoId,
        events: {
          onReady: () => {
            interval = setInterval(() => {
              const duration = player?.getDuration();
              const currentTime = player?.getCurrentTime();

              if (duration && currentTime) {
                const watchedPercent = (currentTime / duration) * 100;

                if (
                  watchedPercent >= 95 &&
                  !completedResources[currentResourceData.id]
                ) {
                  toggleResourceComplete(currentResourceData.id);
                  clearInterval(interval);
                }
              }
            }, 1000);
          },
        },
      });
    };

    const onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      clearInterval(interval);
      player?.destroy();
      player = null;
    };
  }, [currentResourceData.url, currentResourceData.id, completedResources]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-background p-2 rounded-md shadow-md text-sm flex items-center gap-2">
            <Circle className="h-3 w-3 animate-ping text-blue-500" />
            <span>Saving progress...</span>
          </div>
        )}
        {lastSaved && !isSaving && (
          <div className="fixed bottom-4 right-4 bg-background p-2 rounded-md shadow-md text-sm text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <span>Courses</span>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {course.title}
              </h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.resources.length} resources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>6 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>245 students</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
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
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount} of {course.resources.length} resources completed
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    variant={
                      completedResources[currentResourceData.id]
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      toggleResourceComplete(currentResourceData.id)
                    }
                  >
                    {completedResources[currentResourceData.id] ? (
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
                  <p className="text-muted-foreground">
                    {currentResourceData.description}
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    {currentResourceData.type === "youtube" ? (
                      <div className="aspect-video w-full">
                        <div className="aspect-video w-full">
                          <div
                            id="youtube-player"
                            className="w-full h-full rounded-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Article content would be shown here
                        </p>
                        <Button asChild>
                          <a
                            href={currentResourceData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Read Article
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNotesVisible(!notesVisible)}
                  >
                    {notesVisible ? "Hide Notes" : "Take Notes"}
                  </Button>

                  {notesVisible && editor && (
                    <div className="mt-4 border rounded-lg bg-background p-4 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            editor.chain().focus().toggleBold().run()
                          }
                          className={editor.isActive("bold") ? "bg-accent" : ""}
                        >
                          <strong>B</strong>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                          }
                          className={
                            editor.isActive("italic") ? "bg-accent" : ""
                          }
                        >
                          <em>I</em>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                          }
                          className={
                            editor.isActive("underline") ? "bg-accent" : ""
                          }
                        >
                          <u>U</u>
                        </Button>
                      </div>

                      <div className="border rounded-md bg-background text-sm text-foreground">
                        <EditorContent
                          editor={editor}
                          className="w-full h-full p-4 min-h-[100px] cursor-text outline-none prose prose-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button size="sm" onClick={onSaveNotes}>
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  )}

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
                        disabled={
                          currentResource === course.resources.length - 1
                        }
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
                    const isCompleted = completedResources[resource.id];
                    return (
                      <button
                        key={resource.id}
                        onClick={() => setCurrentResource(index)}
                        className={`w-full text-left p-4 hover:bg-accent transition-colors border-l-2 ${
                          isActive
                            ? "border-primary bg-accent/50"
                            : isCompleted
                            ? "border-green-500"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
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
