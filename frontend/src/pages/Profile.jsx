
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axiosInstance from "../AxiosConfig.js";


export default function Profile() {
    const navigate = useNavigate();   
    const [profile, setProfile] = useState({
      name: "",
      avatar: "",
      occupation: "",
      bio: "",
      projects: [],
      likedProjects: [],
      githubUrl: "",
      twitterUrl: "",
      linkedinUrl: ""
    });
  
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
            projects: res.data.your_posts,
            likedProjects: res.data.liked_posts
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
  
    const {
      name,
      avatar,
      occupation,
      bio,
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

        <div className="text-center mb-8">
          <img
            className="h-32 w-32 rounded-full mx-auto mb-4"
            src={avatar || "images/default-avatar.png"}
            alt={`${name}'s avatar`}
          />
          <h1 className="text-3xl font-bold">{name?.trim() ? name : "Your Name"}</h1>
          <p className="text-gray-400">{occupation || "Developer"}</p>
        </div>

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

