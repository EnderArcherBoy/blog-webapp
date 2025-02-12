import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromAuth } from "@/lib/auth";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

type ArticleUpdateInput = {
    title?: string;
    content?: string;
    status?: string;
    image?: string | null;
};

async function saveImage(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory in public folder
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    return `/uploads/${fileName}`; // This will be stored in the database
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

async function checkArticlePermission(articleId: string, user: any) {
  const article = await prisma.article.findUnique({ 
    where: { id: articleId },
    select: {
      id: true,
      authorId: true
    }
  });

  if (!article) {
    return { allowed: false, error: "Article not found", status: 404 };
  }

  // Admin can do anything
  if (user.role === "admin") {
    return { allowed: true, article };
  }

  // Writers can only modify their own articles
  if (user.role === "writer" && article.authorId === user.id) {
    return { allowed: true, article };
  }

  return { allowed: false, error: "You don't have permission to modify this article", status: 403 };
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify user authentication
    const user = await getUserFromAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to modify this article
    const { allowed, error, status, article } = await checkArticlePermission(params.id, user);
    if (!allowed) {
      return NextResponse.json({ error }, { status });
    }

    // Get form data
    const formData = await req.formData();
    console.log('Received form data:', {
      title: formData.get('title'),
      hasContent: !!formData.get('content'),
      hasImage: !!formData.get('image')
    });

    // Build update data
    const updateData: ArticleUpdateInput = {};
    
    const title = formData.get('title');
    if (title && typeof title === 'string') {
      updateData.title = title;
    }
    
    const content = formData.get('content');
    if (content && typeof content === 'string') {
      updateData.content = content;
    }

    const image = formData.get('image');
    if (image instanceof File) {
      try {
        const imageUrl = await saveImage(image);
        updateData.image = imageUrl;
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    console.log('Updating article with data:', updateData);

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify user authentication
    const user = await getUserFromAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to delete this article
    const { allowed, error, status, article } = await checkArticlePermission(params.id, user);
    if (!allowed) {
      return NextResponse.json({ error }, { status });
    }

    // Delete the article
    await prisma.article.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Restructure the response to include authorId at the top level
    const response = {
      ...article,
      authorId: article.author.id,
      author: {
        username: article.author.username,
        email: article.author.email
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "writer" && user.role !== "admin") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const { title, content } = await req.json();
    
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
    });

    return NextResponse.json({ message: "Article created", article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}