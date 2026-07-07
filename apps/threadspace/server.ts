import http from "http";
import app from "./src/app";
const PORT = process.env.PORT || 8086;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
