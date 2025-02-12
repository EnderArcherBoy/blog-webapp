"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { getToken, getUserRole, getUserId } from "@/lib/auth";
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/protected-route';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
}

const ManageArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const role = getUserRole();
      const uid = getUserId();
      console.log('Initial auth state:', { role, uid }); // Debug log
      setUserRole(role);
      setUserId(uid);
      fetchArticles();
    };
    init();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Articles response:', data); // Debug log

      // Handle both possible response formats
      const articlesData = Array.isArray(data) ? data : data.articles || [];
      
      // Transform the data to match our interface if needed
      const formattedArticles = articlesData.map((article: any) => {
        console.log('Processing article:', { 
          id: article.id, 
          authorId: article.authorId,
          title: article.title 
        }); // Debug log
        return {
          id: article.id,
          title: article.title,
          content: article.content,
          createdAt: article.createdAt,
          author: {
            id: article.authorId || article.author?.id || 'unknown',
            username: article.author?.username || 'Unknown Author',
            email: article.author?.email || ''
          }
        };
      });

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, authorId: string) => {
    // Check if user has permission to delete
    if (userRole !== 'admin' && userId !== authorId) {
      toast.error("You don't have permission to delete this article");
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this article?');
    if (!confirmed) return;

    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      toast.success('Article deleted successfully');
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const canEditArticle = (authorId: string) => {
    console.log('Can edit check:', { userRole, userId, authorId }); // Debug log
    return userRole === 'admin' || (userRole === 'writer' && userId === authorId);
  };

  const content = (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          <Link href="/dashboard">Dashboard</Link>
        </h2>
        <ul className="space-y-4">
          {userRole === "admin" && (
            <li className="cursor-pointer hover:text-gray-300">
              <Link href="/dashboard/manage-users">Manage Users</Link>
            </li>
          )}
          <li className="cursor-pointer hover:text-gray-300">
            <Link href="/dashboard/manage-articles">Manage Articles</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-300">
            <Link href="/dashboard">Go Back</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {userRole === 'writer' ? 'Articles' : 'All Articles'}
            </h2>
            <Link 
              href="/articles/create" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Create New Article
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">Loading articles...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Title</th>
                    <th className="border border-gray-300 px-4 py-2">Author</th>
                    <th className="border border-gray-300 px-4 py-2">Created At</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="border border-gray-300 px-4 py-2">{article.title}</td>
                      <td className="border border-gray-300 px-4 py-2">{article.author.username}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 space-x-2">
                        <Link
                          href={`/article/${article.id}`}
                          className="text-green-500 hover:text-green-700"
                        >
                          View
                        </Link>
                        {userRole === 'admin' || userRole === 'writer' ? (
                          <>
                            <Link
                              href={`/dashboard/manage-articles/edit-article/${article.id}`}
                              className={`${canEditArticle(article.author.id) 
                                ? 'text-blue-500 hover:text-blue-700' 
                                : 'text-gray-400 cursor-not-allowed'}`}
                              onClick={(e) => {
                                if (!canEditArticle(article.author.id)) {
                                  e.preventDefault();
                                  toast.error("You can only edit your own articles");
                                }
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                if (canEditArticle(article.author.id)) {
                                  handleDeleteArticle(article.id, article.author.id);
                                } else {
                                  toast.error("You can only delete your own articles");
                                }
                              }}
                              className={`${canEditArticle(article.author.id)
                                ? 'text-red-500 hover:text-red-700'
                                : 'text-gray-400 cursor-not-allowed'}`}
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <ProtectedRoute allowedRoles={['admin', 'writer']}>{content}</ProtectedRoute>;
};

export default ManageArticles;
