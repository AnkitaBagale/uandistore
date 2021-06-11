# uandistore

U&amp;I store database

### Tech:

- Express JS
- MongoDB
- Mongoose
- JWT

### Completed functionalities:

The BE code has routes for ecommerce, video library, quiz, social media apps.

### Users collection is common for both apps.

### Ecommerce App:

1. Cart and Wishlist

   - Add or remove product

1. Authentication- JWT Authentication

   - Login, Signup, Forgot Password

1. Address Management
   - Add new address, update/delete existing address
   - Addresss id is referenced in cart collection to keep it persistent in Cart page when user selects the preference.

### Video Library App:

1. Authentication- JWT Authentication

   - Login, Signup, Forgot Password

1. Playlist management

   - Create new playlist, Update/Delete playlist
   - Add or remove video in playlist
   - Default playlists- history, liked videos, watch later

1. Notes Management
   - Create new note, Update/delete note

### Quiz App:

1. Authentication- JWT Authentication
   - Login, Signup, Forgot Password
1. Multiple Categories
1. Multiple Quizzes
1. Store user's score for the quiz
1. HighScore management

### Social Media App-

1. Authentication- JWT Authentication
   - Login, Signup, Forgot Password, U&I OAuth
1. Create new post, like post, posts feed
1. Follow and unfollow user
1. Remove user from viewer's followers' list
1. View and Update Profile
