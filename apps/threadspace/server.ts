import http from "http";
import app from "./src/app";
import redis from "./src/config/redis";
const PORT = process.env.PORT || 8086;

const server = http.createServer(app);

redis.ping();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
