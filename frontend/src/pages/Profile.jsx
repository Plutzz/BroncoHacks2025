
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Github, PencilLineIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axiosInstance from "../AxiosConfig.js";
import { useToast } from "../components/ui/use-toast";

const TECH_TAGS = [
  "JavaScript", "React", "Node.js", "Python", "Java", "DevOps",
  "Machine Learning", "Cloud Computing", "Cybersecurity", "Mobile Development", "Game Development",
  "Data Science", "Blockchain", "Web Development", "UI/UX Design",
];

export default function Profile() {
    const navigate = useNavigate();   
    const { toast } = useToast();
    const [profile, setProfile] = useState({
      name: "",
      avatar: "",
      occupation: "",
      email: "",
      bio: "",
      projects: [],
      likedProjects: [],
      githubUrl: "",
      twitterUrl: "",
      linkedinUrl: ""
    });

    const [editing, setEditing] = useState(false);
    const fileRef = useRef();
    const [formData, setFormData] = useState({
      name : "",
      occupation : "",
      bio : "",
      email : "",
      avatar : "",
      tags : [],
    })
    
    useEffect(() => {
      axiosInstance
        .get("api/userprofile/profile-data/")
        .then(res => {
          console.log("Profile data:", res.data);
          setProfile({
            name: res.data.username,
            avatar: res.data.avatar,
            occupation: res.data.occupation,
            bio: res.data.bio,
            email: res.data.email,
            tags: res.data.tags,
            projects: res.data.your_posts,
            likedProjects: res.data.liked_posts
          });
          setFormData({
            name: res.data.username,
            occupation: res.data.occupation,
            bio: res.data.bio,
            avatar: res.data.avatar,
            email: res.data.email,
            tags: res.data.tags,
          });
        })
        .catch(err => console.error("Failed to load profile:", err));
    }, []);

    const handleSignOut = async () => {
      const response = await axiosInstance.post("api/accounts/logout/") 
        .catch(err => console.error("Logout failed:", err));

      console.log(response.data);
      navigate("/login");
  
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value
      }));
    };
  
    const toggleTag = (tag) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      try {
          const fd = new FormData();
          fd.append('username', formData.name);
          fd.append('occupation', formData.occupation);
          fd.append('bio', formData.bio);
          fd.append('email', formData.email);
          fd.append('tags', formData.tags);
          console.log(formData.tags)
          if (fileRef.current.files[0]) {
            fd.append('avatar', fileRef.current.files[0]);
          }
          await axiosInstance.patch('api/accounts/update/', fd, {
            headers: {'Content-Type': 'multipart/form-data'}
          });
          setProfile(prev => ({ ...prev, ...formData }));
          setEditing(false);
          toast({ title: "Profile updated successfully" });
        } catch (err) {
          console.error("Update failed:", err);
          toast({ title: "Failed to update profile." });
        }
      };
      
    const {
      name,
      avatar,
      occupation,
      bio,
      tags = [],
      projects = [],
      likedProjects = [],
      githubUrl,
      twitterUrl,
      linkedinUrl
    } = profile;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {editing ? (
          <form onSubmit={handleProfileUpdate} encType="multipart/form-data" className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
            <input
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
            />
            <input
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
            />
            <textarea
              name="bio"
              placeholder="Tell us a bit about yourself."
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
            />
            <div className="block mb-2 text-center mt-4">
              <label className="block mb-2">Upload Your Avatar</label>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
              />
            </div>
            <div>
              <label className="block mb-2 text-center mt-4">Select Your Interests</label>
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
            <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg">Save</button>
          </form>
        ) : (
        <div className="relative mb-8">
          <PencilLineIcon onClick={() => setEditing(true)} className="bsolute top-2 right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer h-6 w-6"/>
          <div className="text-center mb-8">
              <img
                className="h-32 w-32 rounded-full mx-auto mb-4"
                src={avatar || "images/default-avatar.png"}
                alt={`${name}'s avatar`}
              />
              <h1 className="text-3xl font-bold">{name?.trim() ? name : "Your Name"}</h1>
              <p className="text-gray-400 mb-4">{occupation || "Developer"}</p>
              <p className="text-sm text-gray-500 mb-6">
              {tags?.map((tag, index) => (
                <span key={index} className="mr-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <p className="text-gray-300">{bio || "Tell us a bit about yourself."}</p>
        </section>

        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <h2 className="w-5 h-5 text-blue-400"/> My Projects
        </h2>
        <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
          <ul className="divide-y divide-gray-700">
            {projects.length > 0 ? (
              projects.map((p) => (
                <li key={p.id} className="py-2">
                  <Link
                    to={`/post/${p.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <img
                      src={avatar || "/images/default-avatar.png"}
                      alt={`${name}'s avatar`}
                      className="h-6 w-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium truncate">
                        {p.title}
                      </div>
                      {p.description && (
                        <div className="text-gray-400 text-sm truncate">
                          {p.description.substring(0, 80)}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-2 text-gray-400">No posted projects yet.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <h2 className="w-5 h-5 text-blue-400"/> Liked Projects
        </h2>
        <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
          <ul className="divide-y divide-gray-700">
            {likedProjects.length > 0 ? (
              likedProjects.map((p) => (
                <li key={p.id} className="py-2">
                  <Link
                    to={`/post/${p.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <img
                      src={p.avatar || avatar || "/images/default-avatar.png"}
                      alt={`${p.author}'s avatar`}
                      className="h-6 w-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium truncate">
                        {p.title}
                      </div>
                      {p.description && (
                        <div className="text-gray-400 text-sm truncate">
                          {p.description.substring(0, 80)}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-2 text-gray-400">No liked projects yet.</li>
            )}
          </ul>
        </div>
      </section>
        <div className="flex justify-end mb-6">
        <Button variant="destructive" onClick={handleSignOut}>
          Log Out
        </Button>
      </div>
      </motion.div>
    );
}

