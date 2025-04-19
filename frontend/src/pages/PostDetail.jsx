
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ArrowLeft, Github, Trash, PencilLine } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import axiosInstance from "../AxiosConfig.js";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadDetail();
  }, [id]);

  async function loadDetail() {
    // fetch all posts, then find this one
    const resp = await axiosInstance.get("api/posts/fetch_posts/");
    const found = resp.data.data.find((p) => p.id === Number(id));
    if (found) {
      setPost(found);
      setIsLiked(found.liked_by_user ?? false);
    } else {
      setPost(null);
    }

    // try to fetch current user, but don’t redirect on failure
    try {
      const userRes = await axiosInstance.get("api/accounts/get_current_user/");

      if (userRes == null) {
        setCurrentUser(null);
      } else {
        setCurrentUser(userRes.data);
      }
    } catch {
      setCurrentUser(null);
    }
  }
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


  const handleToggleLike = async () => {
      if (!(await ensureLoggedIn())) return;
      // toggle on server
      await axiosInstance.post("api/posts/like/", { post_id: post.id });
      loadDetail();
      // // update UI count  flag
      // setPost(prev => ({
      //   ...prev,
      //   likes_count: prev.likes_count + (isLiked ? -1 : 1)
      // }));
      // setIsLiked(prev => !prev);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!(await ensureLoggedIn())) return;
    if (!comment.trim()) return;

    const newComment = {
      post_id: post.id,
      text: comment,
    };

    const response = await axiosInstance.post("/api/posts/comment/", newComment);
      console.log(response);
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
      window.location.reload();
  };

  const handleEdit = () => {
    navigate(`/post/${id}/edit`);
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
        onClick={() => navigate("/home")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="relative rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            className="h-12 w-12 rounded-full"
            alt={`${post.author}'s avatar`}
            src={post.authorAvatar || "/images/default-avatar.png"}
          />
          <div>
            <h3 className="font-semibold">{post.author}</h3>
            <p className="text-sm text-gray-400">{post.date}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-400 mb-4">{post.pitch}</p>
        <p className="text-gray-300 mb-6">{post.content}</p>
        <p className="text-sm text-gray-500 mb-6">
          {post.tags?.map((tag, index) => (
            <span key={index} className="mr-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </p>
        {/* Add images/documents */}
        {Array.isArray(post.files) && post.files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Attachments</h3>
          <div className="flex flex-wrap gap-4">
            {post.files.map((fileUrl, idx) =>
              /\.(jpe?g|png|gif)$/i.test(fileUrl) ? (
                <img
                  key={idx}
                  src={fileUrl}
                  alt={`attachment-${idx}`}
                  className="max-h-48 rounded border border-gray-600"
                />
              ) : /\.(mp4|webm|ogg)$/i.test(fileUrl) ? (
                <video
                  key={idx}
                  src={fileUrl}
                  controls
                  className="max-h-60 rounded border border-gray-600"
                />
              ) : (
                <a
                  key={idx}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {fileUrl.split("/").pop()}
                </a>
              )
            )}
          </div>
        </div>
      )}

        {currentUser?.user.id === post.author_id && (
          <>
            <Trash
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="absolute top-4 right-4 cursor-pointer"
            />
            <PencilLine
              onClick={handleEdit}
              className="absolute top-4 right-12 cursor-pointer text-blue-400 hover:text-blue-300"
            />

            {showDeleteDialog && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete this post?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const response = await axiosInstance.post("api/posts/delete_post/", {
                          id: post.id,
                        });
                        toast({
                          title: "Success",
                          description: "Post deleted successfully.",
                        });
                        navigate("/home");
                      }}
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteDialog(false)} // Close the dialog
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {post.tech_stack && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {post.tech_stack.split(",").map((tech) => (
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
        {post.github_link && (
          <a
            href={post.github_link}
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
            variant={isLiked ? "destructive" : "ghost"}
            size="sm"
            onClick={handleToggleLike}
            className="flex items-center gap-2"
          >
          <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-current" : ""}`} />
            <span>{post.likes_count || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count}</span>
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
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

