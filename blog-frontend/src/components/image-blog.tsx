"use client";

import { useRouter } from 'next/navigation';
import Card from "./Card";
import { useEffect, useState } from "react";
import { fetchArticles } from "@/lib/api";
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  createdAt: string;
  author: {
    username: string;
  };
}

export default function BlogImage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    getArticles();
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-gray-100">
      <div className="absolute inset-0">
        <Image
          src="/images/header-bg.jpg"
          alt="Blog Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-gray-200 max-w-2xl">
          Discover interesting articles and stay updated with the latest news and insights.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => router.push(`/article/${article.id}`)}
              className="cursor-pointer"
            >
              <Card
                image={article.image 
                  ? `${process.env.NEXT_PUBLIC_API_URL}${article.image}` 
                  : '/images/placeholder.jpg'}
                title={article.title}
                description={article.content.length > 150 
                  ? `${article.content.substring(0, 150)}...` 
                  : article.content}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
