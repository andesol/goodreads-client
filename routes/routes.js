const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const htmlToText = require('html-to-text');

router.get('/', (req, res) => {
    res.render('form');
});

router.get('/random', async (req, res) => {
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
            res.render('error', { msg: 'User not found' });
            return;
        }

        const data = await response.text();

        xml2js.parseString(data, (err, result) => {

            const booksRaw = result.GoodreadsResponse.reviews[0].review;

            const books = booksRaw.map((book) => ({
                title: book.book[0].title[0],
                author: book.book[0].authors[0].author[0].name[0],
                image: book.book[0].image_url[0],
                rating: book.book[0].average_rating[0],
                description: htmlToText.fromString(book.book[0].description[0]),
                link: book.book[0].link[0],
            }));

            const randomNumber = Math.floor(Math.random() * books.length + 1);

            const chosenBook = books[randomNumber];
            res.render('individualBook', { book: chosenBook, user: user })
        });

    } catch (err) {
        res.render('error', { msg: 'Something went wrong' });
    }
});

module.exports = router;