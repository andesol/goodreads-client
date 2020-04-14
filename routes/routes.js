const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const querystring = require('querystring');

var cache = [];

router.get('/', (req, res) => {
    console.log(req.query);
    res.render('form');
});

router.get('/book', async (req, res) => {
    // Development
    // user = '7554526-andreu';
    // console.log(books);
    // res.render('books', { books, user })
    try {
        const qs = querystring.stringify({
            key: process.env.KEY,
            v: process.env.VERSION,
            per_page: process.env.PER_PAGE,
            shelf: process.env.SHELF,
        });
        const user = req.query.user;
        const response = await fetch(
            `https://www.goodreads.com/review/list/${user}.xml?${qs}`
        );
        if (response.status === 404) {
            res.send('<h1>User not found</h1>')
        }

        const data = await response.text();
        xml2js.parseString(data, (err, result) => {
            const booksRaw = result.GoodreadsResponse.reviews[0].review;

            const books = booksRaw.map((book) => ({
                title: book.book[0].title[0],
                author: book.book[0].authors[0].author[0].name[0],
                image: book.book[0].image_url[0],
                rating: book.book[0].average_rating[0],
                description: book.book[0].description[0],
            }));

            cache.books = books;
            cache.user = user;

            const randomNumber = Math.floor(Math.random() * books.length + 1);

            const chosenBook = books[randomNumber];



            res.render('individualBook', { book: chosenBook })
            // res.render('books', { books, user })
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error',
        });
    }
});

router.get('/booklist', (req, res) => {

    const books = cache.books;
    const user = cache.user;

    console.log(books)

    res.render('bookList', { books, user })


});

module.exports = router;