
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../AxiosConfig.js";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const foundPost = posts.find((p) => p.id === Number(id));
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  const ensureLoggedIn = async () => {
    try {
      const res = await axiosInstance.get("api/accounts/check_authentication/");
      if (!res.data.authenticated) {
        toast({ title: "Please log in first" });
        navigate("/login");
        return false;
      }
      return true;
    } catch {
      toast({ title: "Please log in first" });
      navigate("/login");
      return false;
    }
  };

  const handleLike = async () => {
    if (!(await ensureLoggedIn())) return;

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPosts = posts.map((p) =>
      p.id === Number(id) ? { ...p, likes: (p.likes || 0) + 1 } : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setPost((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!(await ensureLoggedIn())) return;
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comment,
      author: "Anonymous User",
      date: new Date().toLocaleDateString(),
    };

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPosts = posts.map((p) =>
      p.id === Number(id)
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setPost((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setComment("");
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feed
      </Button>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            className="h-12 w-12 rounded-full"
            alt={`${post.author}'s avatar`}
            src="https://images.unsplash.com/photo-1666892666066-abe5c4865e9c"
          />
          <div>
            <h3 className="font-semibold">{post.author}</h3>
            <p className="text-sm text-gray-400">{post.date}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-300 mb-6">{post.description}</p>

        {post.techStack && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {post.techStack.split(",").map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-gray-700 text-sm"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* DELETE POST IF IT IS THE SAME AUTHOR */}
        {user?.id === post.authorId && (
          <Button
            variant="destructive"
            onClick={() => {
              const posts = JSON.parse(localStorage.getItem("posts") || "[]");
              const updatedPosts = posts.filter(p => p.id !== id);
              localStorage.setItem("posts", JSON.stringify(updatedPosts));
              toast({
                title: "Success",
                description: "Post deleted successfully."
              });
              navigate("/");
            }}
          >
            Delete Post
          </Button>
        )}
        {post.githubLink && (
          <a
            href={post.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        )}

        <div className="flex items-center gap-4 border-t border-gray-700 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none mb-2"
              rows="3"
            />
            <Button type="submit">Post Comment</Button>
          </form>

          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div
                key={comment.id}
                className="border-l-2 border-gray-700 pl-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-400">
                    {comment.date}
                  </span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

