'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { createArticle } from '@/lib/api';

export default function CreateNewBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getToken();
      if (!token) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      setLoading(true);
      
      if (!title || !content) {
        toast.error('Title and content are required');
        return;
      }

      const formData = {
        title,
        content,
        image: image || undefined
      };

      await createArticle(formData);
      toast.success('Article created successfully');
      router.push('/dashboard/manage-articles');
    } catch (error) {
      console.error('Failed to create article:', error);
      if (error instanceof Error && error.message === 'Not authenticated') {
        toast.error('Please login first');
        router.push('/login');
      } else {
        toast.error('Failed to create article');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl p-6 space-y-6 bg-white shadow-xl rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your thoughts with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image (Optional)
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {previewUrl && (
              <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px]"
              placeholder="Write your article content here..."
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Article'}
          </Button>
        </form>
      </Card>
    </div>
  );
}