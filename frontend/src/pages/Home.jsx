
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Developer Projects Feed</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 hover:border-gray-600 transition-colors"
          >
            <Link to={`/post/${post.id}`}>
              <div className="flex items-center gap-4 mb-4">
                <img className="h-10 w-10 rounded-full" alt="User avatar" src="https://images.unsplash.com/photo-1666892666066-abe5c4865e9c" />
                <div>
                  <h3 className="font-semibold">{post.author}</h3>
                  <p className="text-sm text-gray-400">{post.date}</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.description}</p>
            </Link>
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
              <Link to={`/post/${post.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments?.length || 0}</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Home;
