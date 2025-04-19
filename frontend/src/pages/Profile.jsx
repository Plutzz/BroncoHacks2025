
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "../components/ui/button";
import axiosInstance from "../AxiosConfig.js";


export default function Profile() {
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
        .get("api/accounts/profile/")
        .then(res => setProfile(res.data))
        .catch(err => console.error("Failed to load profile:", err));
    }, []);

    const handleSignOut = () => {
      axiosInstance.post("api/accounts/logout/") 
        .then(() => navigate("/login"))
        .catch(err => console.error("Logout failed:", err));
    };
  
    const {
      name,
      avatar,
      occupation,
      bio,
      projects,
      likedProjects,
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
            src={avatar || "/default-avatar.png"}
            alt={`${name}'s avatar`}
          />
          <h1 className="text-3xl font-bold">{name || "Your Name"}</h1>
          <p className="text-gray-400">{occupation || "Your Occupation"}</p>
        </div>

        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <p className="text-gray-300">{bio || "Tell us a bit about yourself."}</p>
        </section>

        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          <ul className="list-disc list-inside text-gray-300">
            {projects.length > 0
              ? projects.map(p => <li key={p.id}>{p.title}</li>)
              : <li>No projects yet.</li>
            }
          </ul>
        </section>

        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Liked Projects</h2>
          <ul className="list-disc list-inside text-gray-300">
            {likedProjects.length > 0
              ? likedProjects.map(p => <li key={p.id}>{p.title}</li>)
              : <li>No liked projects yet.</li>
            }
          </ul>
        </section>

        <div className="flex justify-center gap-4">
          {githubUrl && (
            <Button as="a" href={githubUrl} variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          )}
          {twitterUrl && (
            <Button as="a" href={twitterUrl} variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
          )}
          {linkedinUrl && (
            <Button as="a" href={linkedinUrl} variant="ghost" size="icon">
              <Linkedin className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.div>
    );
}

