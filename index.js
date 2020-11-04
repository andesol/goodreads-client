const http = require('http');
const app = require('./app');
const config = require('./config/config')

const server = http.createServer(app);

const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});