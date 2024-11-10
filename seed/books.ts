import { Book, BookPublisher } from '../shared/types';


export const books: Book[] = [
  {
    id: 1,
    coverImagePath: '/path/to/cover1.jpg',
    genreIds: [1, 3], 
    originalLanguage: 'en',
    originalTitle: 'The Mysterious Island',
    author: 'Jules Verne',
    publicationDate: '1874-01-01',
    synopsis: 'A group of castaways find themselves stranded on a mysterious island full of strange secrets and adventures.',
    pageCount: 560,
    popularity: 9.8,
    averageRating: 4.5,
    ratingsCount: 12345,
    isEbook: false,
  },
  {
    id: 2,
    coverImagePath: '/path/to/cover2.jpg',
    genreIds: [2, 5],
    originalLanguage: 'en',
    originalTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    publicationDate: '1813-01-28',
    synopsis: 'The romantic story of Elizabeth Bennet and Mr. Darcy as they navigate issues of love, class, and misunderstanding.',
    pageCount: 432,
    popularity: 8.7,
    averageRating: 4.8,
    ratingsCount: 76543,
    isEbook: true,
  },
  {
    id: 3,
    coverImagePath: '/path/to/cover3.jpg',
    genreIds: [4], 
    originalLanguage: 'fr',
    originalTitle: 'Les Misérables',
    author: 'Victor Hugo',
    publicationDate: '1862-04-04',
    synopsis: 'A sweeping tale of redemption and social justice set in 19th-century France, centering around the struggles of Jean Valjean.',
    pageCount: 1232,
    popularity: 9.5,
    averageRating: 4.7,
    ratingsCount: 34221,
    isEbook: false,
  },
  {
    id: 4,
    coverImagePath: '/path/to/cover4.jpg',
    genreIds: [1, 6], 
    originalLanguage: 'en',
    originalTitle: '1984',
    author: 'George Orwell',
    publicationDate: '1949-06-08',
    synopsis: 'A dystopian novel set in a totalitarian society governed by the Party, where Big Brother watches everything and individuality is crushed.',
    pageCount: 328,
    popularity: 9.2,
    averageRating: 4.6,
    ratingsCount: 89012,
    isEbook: true,
  },
  {
    id: 5,
    coverImagePath: '/path/to/cover6.jpg',
    genreIds: [2, 8], 
    originalLanguage: 'en',
    originalTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publicationDate: '1960-07-11',
    synopsis: 'A novel set in the Deep South during the 1930s, focusing on the young Scout Finch and her father, Atticus, as he defends a black man wrongly accused of raping a white woman.',
    pageCount: 281,
    popularity: 9.4,
    averageRating: 4.9,
    ratingsCount: 102344,
    isEbook: true,
  }
];

export const bookPublishers: BookPublisher[] = [
  {
    bookId: 1,
    publisherName: 'Pierre-Jules Hetzel',
    publisherDescription: 'Pierre-Jules Hetzel was a French editor and publisher, who is best known for his collaborations with Jules Verne.',
    country: 'France'
  },
  {
    bookId: 2,
    publisherName: 'T. Egerton, Whitehall',
    publisherDescription: 'T. Egerton, Whitehall was a British publisher who published the first edition of Pride and Prejudice.',
    country: 'United Kingdom'
  },
  {
    bookId: 3,
    publisherName: 'Charles Laffite',
    publisherDescription: 'Charles Laffite was a French publisher who published the first edition of Les Misérables.',
    country: 'France'
  },
  {
    bookId: 4,
    publisherName: 'Secker & Warburg',
    publisherDescription: 'Secker & Warburg was a British publishing company that published the first edition of 1984.',
    country: 'United Kingdom'
  },
  {
    bookId: 5,
    publisherName: 'J.B. Lippincott & Co.',
    publisherDescription: 'J.B. Lippincott & Co. was an American publishing house that published the first edition of To Kill a Mockingbird.',
    country: 'United States'
  }
];

