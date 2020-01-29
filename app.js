require('dotenv').config();
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const shelf = 'to-read';
app.get('/api', async (req, res) => {
  try {
    const key = process.env.KEY;
    const shelf = 'to-read';
    const perPage = 200; // 200 max

    const response = await fetch(
      `http://www.goodreads.com/review/list/7554526.xml?key=${key}&v=2&shelf=${shelf}&per_page=${perPage}`
    );
    const data = await response.text();

    if (data.errors && data.errors.length > 0) {
      return res.status(400).json({
        message: 'Not found'
      });
    }
    let booksArr = [];
    xml2js.parseString(data, (err, result) => {
      const books = result['GoodreadsResponse']['reviews'][0]['review'];

      books.forEach(book =>
        booksArr.push({
          title: book['book'][0]['title'][0],
          author: book['book'][0]['authors'][0]['author'][0]['name'][0],
          image: book['book'][0]['image_url'][0],
          rating: book['book'][0]['average_rating'][0],
          description: book['book'][0]['description'][0]
        })
      );
      res.json(booksArr);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
