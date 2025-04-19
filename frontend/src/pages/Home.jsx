
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookMarked, Tag, Filter, Heart, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosInstance from "../AxiosConfig.js";
import { useToast } from "../components/ui/use-toast";

const POPULAR_TAGS = [
  "JavaScript", "React", "Node.js", "Python", "Java", "DevOps",
  "Machine Learning", "Cloud Computing", "Cybersecurity", "Mobile Development", "Game Development"
];

function Home() {
  const tags = POPULAR_TAGS;
  const [posts, setPosts] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // HELPER FUNCTIONS
  const loadPosts = async () => {
    try {
      let res;
      if (!searchQuery) {
        res = await axiosInstance.get("api/posts/fetch_posts/");
        setPosts(res.data.data || []);
      } else {
        res = await axiosInstance.get(
          `/api/posts/search/?search=${encodeURIComponent(searchQuery)}`
        );
      }

      if (Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else if (Array.isArray(res.data.results)) {
        setPosts(res.data.results);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Fetch posts failed:", err);
      if (searchQuery) navigate("/home");
    }
  };

  // fetch users posts
  const loadUserProjects = async () => {
    try {
      const res = await axiosInstance.get("api/userprofile/fetch-user-posts/");
      const list = Array.isArray(res.data.data)
        ? res.data.data
        : [];
      console.log("My Projects:", list);
      setUserProjects(list);
    } catch (err) {
      console.error("Fetch my projects failed:", err);
    }
  };

  

  // toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
  };

  // filter posts by selected tags
  const displayPosts = searchQuery
      ? posts
      : posts.filter((post) =>
          selectedTags.length === 0 ||
          post.tags?.some((t) => selectedTags.includes(t))
        );
console.log("Filtered posts:", displayPosts);
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


  const handleLike = async (postId) => {
    if (!(await ensureLoggedIn())) return;
    const response = await axiosInstance.post("api/posts/like/", {post_id:postId})
    loadPosts();
  };

  const handleComments = async (e, postId) => {
    e.preventDefault();
    if (!(await ensureLoggedIn())) return;
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    loadUserProjects();
    loadPosts();
  }, [searchQuery, location.key]);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block w-64 shrink-0" >
        <div className="bg-gray-800 rounded-lg p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">My Projects</h2>
          </div>
          {userProjects.length > 0 ? (
            <ul className="space-y-3">
              {userProjects.map((proj) => (
                <li key={proj.id}>
                  <Link
                    to={`/post/${proj.id}`}
                    className="block p-3 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-medium text-sm">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {proj.pitch?.substring(0, 60) || ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No projects yet</p>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-w-0"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Developer Feed</h1>
            <Link to="/create-post">
              <Button className="bg-green-700 hover:bg-green-800 text-white">Share Project</Button>
            </Link>
          </div>

          {displayPosts.length > 0 ? (
            displayPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02]">
                <Link to={`/post/${post.id}`} className="block" onClick={async (e) => {
                  await axiosInstance.post("api/posts/view_post/", {post_id:post.id});
                  navigate(`/post/${post.id}`);
                }
        
                  }>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.authorAvatar || "/images/default-avatar.png"}
                      alt={`${post.author}'s avatar`}
                      className="h-8 w-8 rounded-full"
                    />
                    <h2 className="text-xl font-semibold hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                    <p className="text-gray-300 mb-4">
                      {post.pitch?.substring(0, 150) || ""}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.map((t) => (
                        <span
                          key={t}
                          className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(post.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleComments(e, post.id)}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0}</span>
                      </Button>
                    </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">
                No posts match the selected tags.
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block w-64 shrink-0"
      >
        <div className="bg-gray-800 rounded-lg p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Filter by Tags</h2>
          </div>
          <div className="space-y-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600/20 text-blue-400"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
