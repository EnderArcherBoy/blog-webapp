"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { getUserRole } from '@/lib/auth';
import Link from 'next/link';
import BlogPage from "../components/banner/banner";

interface Article {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: {
    username: string;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      const articlesData = Array.isArray(data) ? data : data.articles || [];
      setArticles(articlesData);
      setError(null);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <BlogPage />
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Create Article and Dashboard Buttons - Only visible to writers and admins */}
        {(userRole === 'writer' || userRole === 'admin') && (
          <div className="mb-8 flex justify-end px-20 space-x-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/articles/create" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Article
            </Link>
          </div>
        )}

        {/* Massive Bold Text */}
        <div className="text-center mb-12" id="articles">
          <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight">
            Our Blog / Articles
          </h1>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link href={`/article/${article.id}`} key={article.id}>
              <Card
                image={article.image 
                  ? `${process.env.NEXT_PUBLIC_API_URL}${article.image}` 
                  : '/images/placeholder.jpg'}
                title={article.title}
                description={article.content.length > 150 
                  ? `${article.content.substring(0, 150)}...` 
                  : article.content}
              />
            </Link>
          ))}
        </div>

        {/* No Articles Message */}
        {articles.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
}