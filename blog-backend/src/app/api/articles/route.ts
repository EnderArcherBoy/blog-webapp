import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { getUserFromAuth } from '@/lib/auth';

// Add this helper function at the top of the file
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

export async function POST(request: NextRequest) {
  try {
    console.log('Starting article creation...');
    
    // Verify authentication
    const user = await getUserFromAuth(request);
    console.log('Auth check result:', { userId: user?.id, userRole: user?.role });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    if (!['admin', 'writer'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    console.log('Received form data:', {
      title: formData.get('title'),
      hasContent: !!formData.get('content'),
      hasImage: !!formData.get('image')
    });

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      try {
        console.log('Processing image:', { name: image.name, type: image.type });
        imageUrl = await saveImage(image);
        console.log('Image saved:', imageUrl);
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    console.log('Creating article in database:', {
      title,
      contentLength: content.length,
      imageUrl,
      authorId: user.id
    });

    const article = await prisma.article.create({
      data: {
        title,
        content,
        image: imageUrl,
        authorId: user.id
      }
    });

    console.log('Article created successfully:', article.id);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        authorId: true,
        author: {
          select: { 
            id: true,
            username: true, 
            email: true 
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}