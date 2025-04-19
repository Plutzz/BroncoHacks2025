
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axiosInstance from "../AxiosConfig.js";


const TECH_TAGS = [
  "JavaScript", "React", "Node.js", "Python", "Java", "DevOps",
  "Machine Learning", "Cloud Computing", "Cybersecurity", "Mobile Development", "Game Development",
  "Data Science", "Blockchain", "Web Development", "UI/UX Design",
];

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedTags: [],
  });

  const navigate = useNavigate();
  const { toast } = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send signup request
    try {

      const response = await axiosInstance.post('/api/accounts/register/', 
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          tags: formData.selectedTags,
        }
      );

      console.log("Signup attempt:", formData);
      console.log("Response:", response);

      if (response.data.success) {
        navigate("/home");
      } else {
        toast({
          title: "Sign Up failed",
          description: response.data.error,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };


  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-400 mt-2">Join the Dev Drop community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
          {formData.password && (
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          )}

        <div>
          <label className="block mb-2 text-center mt-4">Select Your Interests</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {TECH_TAGS.map(tag => (
              <Button
                key={tag}
                type="button"
                variant={formData.selectedTags.includes(tag) ? "default" : "secondary"}
                onClick={() => toggleTag(tag)}
                className="text-sm"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}

export default Signup;
