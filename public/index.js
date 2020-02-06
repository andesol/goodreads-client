fetch('http://localhost:3000/api', { mode: 'cors' })
  .then(res => res.json())
  .then(json => {
    firstBook = json[0];
    console.log(firstBook);
  })
  .catch(err => console.log(err));
