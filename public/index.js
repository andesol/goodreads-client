fetch('http://localhost:3000/api')
  .then(res => res.json())
  .then(myJson => console.log(json));
