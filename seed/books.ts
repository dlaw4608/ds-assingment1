import { Book } from '../shared/types';

export const books: Book[] = [
  {
    id: 1,
    cover_image_path: '/path/to/cover1.jpg',
    genre_ids: [1, 3], 
    original_language: 'en',
    original_title: 'The Mysterious Island',
    author: 'Jules Verne',
    publication_date: '1874-01-01',
    synopsis: 'A group of castaways find themselves stranded on a mysterious island full of strange secrets and adventures.',
    page_count: 560,
    popularity: 9.8,
    average_rating: 4.5,
    ratings_count: 12345,
    is_ebook: false,
  },
  {
    id: 2,
    cover_image_path: '/path/to/cover2.jpg',
    genre_ids: [2, 5],
    original_language: 'en',
    original_title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publication_date: '1813-01-28',
    synopsis: 'The romantic story of Elizabeth Bennet and Mr. Darcy as they navigate issues of love, class, and misunderstanding.',
    page_count: 432,
    popularity: 8.7,
    average_rating: 4.8,
    ratings_count: 76543,
    is_ebook: true,
  },
  {
    id: 3,
    cover_image_path: '/path/to/cover3.jpg',
    genre_ids: [4], 
    original_language: 'fr',
    original_title: 'Les Misérables',
    author: 'Victor Hugo',
    publication_date: '1862-04-04',
    synopsis: 'A sweeping tale of redemption and social justice set in 19th-century France, centering around the struggles of Jean Valjean.',
    page_count: 1232,
    popularity: 9.5,
    average_rating: 4.7,
    ratings_count: 34221,
    is_ebook: false,
  },
  {
    id: 4,
    cover_image_path: '/path/to/cover4.jpg',
    genre_ids: [1, 6], 
    original_language: 'en',
    original_title: '1984',
    author: 'George Orwell',
    publication_date: '1949-06-08',
    synopsis: 'A dystopian novel set in a totalitarian society governed by the Party, where Big Brother watches everything and individuality is crushed.',
    page_count: 328,
    popularity: 9.2,
    average_rating: 4.6,
    ratings_count: 89012,
    is_ebook: true,
  },
  {
    id: 5,
    cover_image_path: '/path/to/cover6.jpg',
    genre_ids: [2, 8], 
    original_language: 'en',
    original_title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publication_date: '1960-07-11',
    synopsis: 'A novel set in the Deep South during the 1930s, focusing on the young Scout Finch and her father, Atticus, as he defends a black man wrongly accused of raping a white woman.',
    page_count: 281,
    popularity: 9.4,
    average_rating: 4.9,
    ratings_count: 102344,
    is_ebook: true,
  }
];