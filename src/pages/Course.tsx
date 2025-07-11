import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import styles from "./Loader.module.css";

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
  Pencil,
  Share,
  Bookmark,
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import axios from "axios";
import { serverurl } from "../../urls.json";
import { log } from "console";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Resource {
  _id: string;
  url: string;
  courseid: string;
  title: string;
  description: string;
  duration: number;
  isCompleted: boolean;
  metaData: {
    title: string;
    description: string;
    open_graph?: {
      images?: Array<{ url: string }>;
    };
  };
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  tags: string[];
  progress: number;
  completedItems: number;
  totalItems: number;
}

const Course = () => {
  const { id: courseId } = useParams();
  const { course } = useLocation().state;
  const [currentResource, setCurrentResource] = useState(0);
  const [pendingCompletions, setPendingCompletions] = useState<
    Record<string, boolean>
  >({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log("Course ID from params:", course);
  

  const courseDetails: CourseDetails = {
    id: course.id,
    title: course.title,
    description: course.description || "No description available",
    tags: course.tags || [],
    progress: course.progress || 0,
    completedItems: course.completedResc || 0,
    totalItems: course.numberOfResc || 0,
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // console.log(course);

        setLoading(true);
        const token = getSupabaseToken();
        if (!token) {
          console.error("No Supabase token found");
          return;
        }

        const response = await axios.get<{ resources: Resource[] }>(
          `${serverurl}/v1/course/get-all-resc/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("Fetched resources:", response.data.resources);

        setResources(response.data.resources);

        const initialCompletedStatus = response.data.resources.reduce(
          (acc, resource) => {
            acc[resource._id] = resource.isCompleted || false;
            return acc;
          },
          {} as Record<string, boolean>
        );

        setCompletedResources(initialCompletedStatus);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load course resources");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchResources();
    }
  }, [courseId]);

  const [completedResources, setCompletedResources] = useState<
    Record<string, boolean>
  >({});

  const completedCount =
    Object.values(completedResources).filter(Boolean).length;
  const progress =
    resources.length > 0
      ? Math.round((completedCount / resources.length) * 100)
      : courseDetails.progress;

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

  const toggleResourceComplete = async (resourceId: string) => {
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

  const getSupabaseToken = () => {
    const supabaseSession = localStorage.getItem(
      "sb-xxqoscilojosafuiwpxk-auth-token"
    );
    if (!supabaseSession) return null;

    try {
      const session = JSON.parse(supabaseSession);
      return session.access_token;
    } catch (error) {
      console.error("Error parsing Supabase session:", error);
      return null;
    }
  };

  const saveCompletionsToBackend = useCallback(async () => {
    if (isSaving || Object.keys(pendingCompletions).length === 0) return;

    setIsSaving(true);
    try {
      const token = getSupabaseToken();
      if (!token) {
        console.error("No Supabase token found");
        return;
      }

      await axios.post(
        `${serverurl}/v1/course/update-resc-complete-status/${courseId}`,
        { completions: pendingCompletions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLastSaved(new Date());
      setPendingCompletions({});
    } catch (error) {
      console.error("Failed to save completions:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, pendingCompletions, courseId]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(pendingCompletions).length > 0) {
        saveCompletionsToBackend();
      }
    }, 1000);

    return () => {
      clearInterval(saveInterval);
      if (Object.keys(pendingCompletions).length > 0) {
        saveCompletionsToBackend();
      }
    };
  }, [saveCompletionsToBackend, pendingCompletions]);

  const currentResourceData = resources[currentResource] || {
    _id: "",
    url: "",
    title: "Loading...",
    description: "",
    isCompleted: false,
    metaData: { title: "", description: "" },
  };

  const currentId = currentResourceData._id;

  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "", 
    editable: notesVisible,
    onUpdate: ({ editor }) => {
      if (!currentId) return;
      const html = editor.getHTML();
      setNotes((prev) => ({ ...prev, [currentId]: html }));
    },
  });
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentId || !editor) return;
  
      const token = getSupabaseToken();
      if (!token) return;
  
      try {
        const res = await axios.get(
          `${serverurl}/v1/notes/get-notes-by-resc/${currentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const html = res.data?.content || "<p></p>";
  
        setNotes((prev) => ({ ...prev, [currentId]: html }));
        editor.commands.setContent(html);

        // console.log("Fetched notes for resource:", currentId, res);
        
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
  
    fetchNotes();
  }, [currentId, editor]);
  
  useEffect(() => {
    if (editor) editor.setEditable(notesVisible);
  }, [notesVisible, editor]);
  
  const onSaveNotes = async () => {
    if (!editor || !currentId) return;
  
    const html = editor.getHTML();
    const plainText = editor.getText();
  
    setNotes((prev) => ({ ...prev, [currentId]: html }));
  
    const token = getSupabaseToken();
    if (!token) return;
  
    try {
      await axios.post(
        `${serverurl}/v1/notes/save-notes-for-resc/${currentId}`,
        { content: html, plainText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("Notes saved successfully");
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
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
    // if (currentResourceData.type !== "youtube") return;

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
                  !completedResources[currentResourceData._id]
                ) {
                  toggleResourceComplete(currentResourceData._id);
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
  }, [currentResourceData.url, currentResourceData._id, completedResources]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            {/* <p>Loading course content...</p> */}
            <div className={styles.loader}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const truncateText = (text: string, maxWords: number): string => {
    if (!text) return "";
    const words = text.split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status indicators */}
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
            <span className="text-foreground">{courseDetails.title}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {courseDetails.title}
              </h1>
              <p className="text-muted-foreground mb-4">
                {courseDetails.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{resources.length} resources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* <Clock className="h-4 w-4" /> */}
                  {/* <span>6 hours</span> */}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
              {/* {courseDetails ? courseDetails.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                )): <></>} */}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link
                  to={`/edit-course/${courseDetails.id}`}
                  state={{ course: courseDetails }}
                  className="flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Course
                </Link>
              </Button>
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
              {completedCount} of {resources.length} resources completed
            </p>
          </div>
        </div>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {(() => {
                        const Icon = getResourceIcon(currentResourceData.url);
                        return <Youtube className="h-5 w-5" />;
                      })()}
                      <span className="line-clamp-1">
                        {currentResourceData.metaData?.title ||
                        currentResourceData.title
                          ? truncateText(
                              currentResourceData.metaData?.title ||
                                currentResourceData.title,
                              7
                            )
                          : "Untitled Resource"}
                      </span>
                    </CardTitle>
                    <Button
                      size="sm"
                      variant={
                        completedResources[currentResourceData._id]
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        toggleResourceComplete(currentResourceData._id)
                      }
                    >
                      {completedResources[currentResourceData._id] ? (
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
                    <div className="bg-muted rounded-lg p-4">
                      {currentResourceData.url.includes("youtu") ? (
                        <>
                          {/* Video Player */}
                          <div className="aspect-video w-full rounded-lg overflow-hidden mb-5">
                            <div
                              id="youtube-player"
                              className="w-full h-full"
                            />
                          </div>

                          {/* Description - Separated with more space */}
                          {/* {(currentResourceData.metaData?.description || currentResourceData.description) && (
                          <div className="bg-background p-4 rounded-lg border">
                            <h3 className="font-medium mb-2">About this video</h3>
                            <p className="text-muted-foreground">
                              {currentResourceData.metaData?.description || 
                               currentResourceData.description}
                            </p>
                          </div>
                        )} */}
                        </>
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
                            className={
                              editor.isActive("bold") ? "bg-accent" : ""
                            }
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
                        Part {currentResource + 1} of {resources.length}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentResource === 0}
                          onClick={() =>
                            setCurrentResource(currentResource - 1)
                          }
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          disabled={currentResource === resources.length - 1}
                          onClick={() =>
                            setCurrentResource(currentResource + 1)
                          }
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

            {/* Course Outline */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Outline</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {resources.map((resource, index) => {
                      const Icon = getResourceIcon(resource.url);
                      const isActive = index === currentResource;
                      const isCompleted = completedResources[resource._id];
                      return (
                        <button
                          key={resource._id}
                          onClick={() => setCurrentResource(index)}
                          className={`w-full text-left p-4 hover:bg-accent transition-colors border-l-2 ${isActive
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
                                <Youtube className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm font-medium truncate">
                                  {resource.metaData?.title || resource.title
                                    ? truncateText(
                                      resource.metaData?.title ||
                                      resource.title,
                                      6
                                    )
                                    : "Untitled Resource"}
                                </span>
                              </div>
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
        ) : (
          <div className="text-center py-12">
            <p>No resources found for this course</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;
