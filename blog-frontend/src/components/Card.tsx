"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface CardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
}

const Card = ({ image, title, description }: CardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 transition-transform transform hover:scale-105 cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id="blog"
    >
      <div className="relative h-[200px] w-full mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h2 className="text-xl font-semibold mt-2">{title}</h2>
      <p className="text-gray-600 mt-1 line-clamp-3">{description}</p>

      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <p className="text-white text-lg font-semibold">Read More</p>
        </motion.div>
      )}
    </div>
  );
};

export default Card;