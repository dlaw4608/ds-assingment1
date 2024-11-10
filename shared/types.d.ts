export type Book = {
  id: number;
  coverImagePath: string;
  genreIds: number[];
  originalLanguage: string;
  originalTitle: string;
  author: string;
  publicationDate: string;
  synopsis: string;
  pageCount: number;
  popularity: number;
  averageRating: number;
  ratingsCount: number;
  isEbook: boolean;
}

export type BookPublisher = {
  bookId: number;
  publisherName: string;
  country: string;
  publisherDescription: string;
}

export type BookPublisherQueryParams = {
  bookId: string;
  publisherName?: string;
  country?: string;
}