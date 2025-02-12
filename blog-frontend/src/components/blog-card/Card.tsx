"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const Card = ({ image, title, description }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full sm:w-[28rem] md:w-[36rem] bg-white rounded-2xl shadow-lg overflow-hidden p-4 transition-transform transform hover:scale-105 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id="blog"
    >
      <Image src={image} alt={title} width={400} height={200} className="rounded-lg w-full" />
      <h2 className="text-3xl font-semibold mt-4">{title}</h2>
      <p className="text-gray-600 mt-1">{description}</p>

      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl"
        >
          <p className="text-white text-lg font-bold">Read Post</p>
        </motion.div>
      )}
    </div>
  );
};

export default Card;