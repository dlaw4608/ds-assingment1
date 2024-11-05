export type Book = {
  id: number;
  cover_image_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  author: string;
  publication_date: string;
  synopsis: string;
  page_count: number;
  popularity: number;
  average_rating: number;
  ratings_count: number;
  is_ebook: boolean;
}