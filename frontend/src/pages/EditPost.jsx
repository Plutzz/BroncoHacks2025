import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import axiosInstance from "../AxiosConfig.js";

const TECH_TAGS = [
    "JavaScript", "React", "Node.js", "Python", "Java", "DevOps",
    "Machine Learning", "Cloud Computing", "Cybersecurity", "Mobile Development", "Game Development",
    "Data Science", "Blockchain", "Web Development", "UI/UX Design",
  ];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    pitch: "",
    description: "",
    techStack: "",
    files: null,
    githubLink: "",
    tags: [],
  });

  useEffect(() => {
    async function loadPost() {
      const resp = await axiosInstance.get(`/api/posts/${id}/`);
      const p = resp.data.data;

      setFormData({
            title: p.title ?? "",
            pitch: p.pitch ?? "",
            description: p.content ?? "",
            techStack: p.tech_stack ?? "",
            githubLink: p.github_link ?? "",
            tags: p.tags || [],
            files: null,
        });
    }
    loadPost();
  }, [id]);

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value === "" ? null : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    // map our state keys to backend field names
    const fields = {
        title:         formData.title,
        pitch:         formData.pitch,
        description:   formData.description,
        tech_stack:    formData.techStack,
        github_link:   formData.githubLink,
    };
    // use entries so v is defined
    Object.entries(fields).forEach(([k, v]) => {
        // empty or null means clear on server
        fd.append(k, v == null ? "" : v);
    });

    formData.tags.forEach(t => fd.append("tags", t));
    if (fileRef.current.files.length)
      Array.from(fileRef.current.files).forEach(f => fd.append("files", f));

    try {
        // use PATCH to match DRF view
        const resp = await axiosInstance.patch(
            `/api/posts/${id}/update/`,
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("update response:", resp.data);
        toast({ title: "Updated!", description: "Your post has been updated." });
        // redirect back to detail page
        navigate(`/post/${id}`);
    } catch (err) {
        console.error("update failed:", err);
        toast({ title: "Update failed", description: err?.response?.data?.detail || err.message });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
        />
        <input
          name="pitch"
          placeholder="Pitch"
          value={formData.pitch}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description} 
          onChange={handleChange}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
        />
        <input
          name="techStack"
          placeholder="Tech Stack (comma separated)"
          value={formData.techStack}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
        />
        <input
            name="githubLink"
            placeholder="GitHub Link"
            type="url"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
        />
        <div>
            <label className="block mb-2 text-center mt-4">Select Project Tags</label>
            <div className="flex flex-wrap gap-2 justify-center">
            {TECH_TAGS.map(tag => (
                <Button
                key={tag}
                type="button"
                variant={formData.tags.includes(tag) ? "default" : "secondary"}
                onClick={() => toggleTag(tag)}
                className="text-sm"
                >
                {tag}
                </Button>
            ))}
            </div>
        </div>


        <div>
          <label className="block mb-2">Files</label>
          <input
            type="file"
            ref={fileRef}
            multiple
            onChange={e => setFormData(prev => ({ ...prev, files: e.target.files }))}
            accept="image/*"
            className="block w-full text-sm"
          />
        </div>
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
          Save Changes
        </Button>
      </form>
    </motion.div>
  );
}