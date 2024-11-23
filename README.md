## Serverless REST Assignment - Distributed Systems.

__Name:__ Daniel Lawton

__Demo:__ 

### Context.

The context of my WebAPI I developed was to store Books, the books are designed to be stored with the following information:

  + id: number; // Book Unique Identifier
  + genreIds: number[];  // Genre of Book to be stored
  + originalLanguage: string; // 
  + originalTitle: string;
  + author: string;
  + publicationDate: string;
  + synopsis: string;





### App API endpoints.
 
+ Get/movies - Retrieve all books.
+ POST /books - add a new book. (Protected Route)
+ GET /books/{bookId}/ - Get specific book with a specified book ID.
+ GET /books/{bookId}/publisher?bookId & publisherName - Get Information about publisher using Query String parameter (Protected Route)
+ PUT /books/{bookId} - Update an existing book by its ID. (Protected Route)


### Auth API endpoints.
+ POST /auth/signup - Sign up a new user.
+ POST /auth/confirm_signup - Confirma a new user.
+ POST /auth/signin - Sign in a user.
+ GET /auth/signout - Sign out a user.

### Update constraint (if relevant).


- A DynamoDB UpdateExpression is used to specify the Attributes that are to be Updated. Using the fields provided in the request body. (e.g. title, author .. etc) With thses specified fields being the only ones updated. Using placeholders that handle reserved keywords by being mapped to placeholders. This function is executed using the UpdateCommmand, with updated attributes being the response. Is only authorised for use by users who are signed into the WebAPI (Protected Route).




