
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import axiosInstance from "../AxiosConfig.js";


const POPULAR_TAGS = [
  "JavaScript", "React", "Node.js", "Python", "Java", "DevOps",
  "Machine Learning", "Cloud Computing", "Cybersecurity", "Mobile Development", "Game Development",
];


function CreatePost() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    pitch:"",
    tags: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosInstance.post("/api/posts/create/", formData);

    const newPost = {
      id: Date.now(),
      ...formData,
      author: "Anonymous User",
      date: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
    };

    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    localStorage.setItem("posts", JSON.stringify([newPost, ...existingPosts]));

    toast({
      title: "Success!",
      description: "Your project has been posted.",
    });

    navigate("/home");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Share Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Two Sentence Pitch
          </label>
          <input
            type="text"
            name="pitch"
            value={formData.pitch}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Tech Stack
          </label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            GitHub Link (optional)
          </label>
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm border
                  ${formData.tags.includes(tag)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500"}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        
        
        <Button type="submit" className="w-full">
          Share Project
        </Button>
      </form>
    </motion.div>
  );
}

export default CreatePost;
