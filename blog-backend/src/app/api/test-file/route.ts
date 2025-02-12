import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory:', uploadsDir);

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        error: 'Uploads directory does not exist',
        path: uploadsDir
      }, { status: 404 });
    }

    const files = readdirSync(uploadsDir);
    return NextResponse.json({
      message: 'Files in uploads directory',
      files,
      directory: uploadsDir
    });
  } catch (error) {
    console.error('Error checking files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
