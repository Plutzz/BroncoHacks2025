
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const Landing = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <motion.h1
          className="text-6xl font-bold mb-6 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "linear-gradient(to right, #6ee7b7, #3b82f6, #9333ea)",
            backgroundSize: "200% 200%",
            animation: "gradientBreathing 5s ease-in-out infinite",
            WebkitBackgroundClip: "text", /* For Safari */
            backgroundClip: "text",
            color: "transparent", /* Make sure the text color is transparent */
          }}
        >

          DevDrop
        </motion.h1>
        <div className="flex justify-center">
          <img
            src="/images/landing_logo.png"
            alt="DevDrop logo"
            className="h-32 w-32"
          />
        </div>



        <motion.p 
          className="text-2xl text-gray-300 mb-12 mt-6 "
          style={{
            textShadow: '0 0 4px rgba(255, 255, 255, 0.5), 0 0 8px rgba(255, 255, 255, 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Drop Ideas. Build Futures.
        </motion.p>


        <motion.div 
          className="space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all text-white">
              Join the Community
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 transform hover:scale-105 transition-all">
              Sign In
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Share Knowledge</h3>
            <p className="text-gray-400">Post your insights, tutorials, and experiences with the developer community</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Connect</h3>
            <p className="text-gray-400">Network with like-minded developers and build meaningful professional relationships</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Grow Together</h3>
            <p className="text-gray-400">Learn from others' experiences and advance your career in technology</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
