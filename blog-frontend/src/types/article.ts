export interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: File;
}