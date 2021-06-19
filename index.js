require('dotenv').config();

const express = require('express');
const cors = require('cors');
const products = require('./routes/products.router');
const carts = require('./routes/carts.router');
const orders = require('./routes/orders.router');
const users = require('./routes/users.router');
const wishlists = require('./routes/wishlists.router');
const addresses = require('./routes/addresses.router');

const tutors = require('./routes/tutors.router');
const videos = require('./routes/videos.router');
const notes = require('./routes/notes.router');
const playlists = require('./routes/playlists.router');

const quizzes = require('./routes/quizzes.router');
const categories = require('./routes/categories.router');
const quizAttempts = require('./routes/quizAttempts.router');

const socialProfiles = require('./routes/socialProfiles.router');
const posts = require('./routes/posts.router');

const routeNotFoundHandler = require('./middlewares/route-not-found.middlerware');
const allErrorsHandler = require('./middlewares/all-errors-handler.middleware');
const authenticationVerifier = require('./middlewares/authentication-verifier.middleware');
const initializeConnectionToDb = require('./db/db.connect');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

initializeConnectionToDb();

app.get('/', (req, res) => {
	res.send('Welcome to the U&I store');
});

app.use('/products', products);
app.use('/videos', videos);
app.use('/tutors', tutors);
app.use('/quizzes', quizzes);
app.use('/categories', categories);
app.use('/users', users);

/**
 * These endpoint has private and public routes
 */

app.use('/social-profiles', socialProfiles);
app.use('/posts', posts);

/**
 * Authentication verifier middleware, please do not move. Below routes are private.
 */
app.use(authenticationVerifier);
app.use('/wishlist', wishlists);
app.use('/cart', carts);
app.use('/orders', orders);
app.use('/addresses', addresses);
app.use('/notes', notes);
app.use('/playlists', playlists);
app.use('/quiz-attempts', quizAttempts);

/**
 * 404 Route Handler
 * Note: Do Not Move. This should be the last route.
 */
app.use(routeNotFoundHandler);

/**
 * Error Handler
 * Note: Do Not Move.
 */
app.use(allErrorsHandler);

app.listen(process.env.PORT || PORT, () => {
	console.log(`server started`);
});
