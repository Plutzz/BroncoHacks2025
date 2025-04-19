
import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "../components/ui/button";

function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <img 
          className="h-32 w-32 rounded-full mx-auto mb-4"
          alt="Profile picture"
         src="https://images.unsplash.com/photo-1489506020498-e6c1cc350f10" />
        <h1 className="text-3xl font-bold">John Developer</h1>
        <p className="text-gray-400">Full Stack Developer</p>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-300">
          Passionate developer with 5 years of experience in web development.
          I love building innovative solutions and contributing to open-source projects.
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"].map((skill) => (
            <span
              key={skill}
              className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="ghost" size="icon">
          <Github className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Twitter className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Linkedin className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}

export default Profile;
