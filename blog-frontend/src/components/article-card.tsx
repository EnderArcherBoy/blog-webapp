"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useState } from 'react';

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
}

export default function ArticleCard({ id, title, content, imageUrl, authorName, createdAt }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const contentPreview = content.length > 150 ? content.substring(0, 150) + '...' : content;
  const imageUrlWithFallback = imageUrl || '/images/placeholder-article.jpg';

  return (
    <Link href={`/article/${id}`}>
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="w-full h-48 relative">
          <Image
            src={imageUrlWithFallback}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            >
              <span className="text-white text-lg font-semibold">Read More</span>
            </motion.div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-xl mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{contentPreview}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{authorName}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
