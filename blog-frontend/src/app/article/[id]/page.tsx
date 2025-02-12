"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserRole, getToken, getUserId } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  authorId: string;
  author: {
    username: string;
    email: string;
  };
}

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const role = getUserRole();
        const uid = getUserId();
        setUserRole(role);
        setUserId(uid);
        console.log('Auth state:', { role, uid }); // Debug log
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
        console.log('Article data:', data); // Debug log
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch article');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }

      toast.success('Article deleted successfully');
      router.push('/dashboard/manage-articles');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error || 'Article not found'}</div>
      </div>
    );
  }

  const imageUrl = article.image 
    ? `${process.env.NEXT_PUBLIC_API_URL}${article.image}` 
    : '/images/placeholder.jpg';

  const canModifyArticle = 
    userRole === 'admin' || 
    (userRole === 'writer' && article.authorId === userId);

  console.log('Can modify article:', {
    userRole,
    userId,
    articleAuthorId: article.authorId,
    canModify: canModifyArticle
  });

  return (
    <div className="min-h-screen pt-[104px]">
      {/* Hero Section with Image and Title */}
      <div className="relative w-full h-[700px] -z-10">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-20 z-10">
          <div className="max-w-4xl">
            <h1 className="text-7xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="text-[21px] font-medium text-gray-200">
              Published by {article.author.username} on {new Date(article.createdAt).toLocaleDateString()}
            </div>
            
            {/* Edit/Delete buttons */}
            {canModifyArticle && (
              <div className="flex gap-4 mt-6">
                <Link 
                  href={`/dashboard/manage-articles/edit/${article.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                  Edit Article
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Delete Article
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 pb-32">
        <div className="text-lg font-light space-y-6 mb-16">
          {article.content.split(/\n+/).filter(Boolean).map((paragraph, index) => (
            <p key={index} className="leading-relaxed whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}