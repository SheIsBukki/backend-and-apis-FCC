import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3001;

// THIS DOESN'T WORK ON THE BROWSER
// const server = http.createServer((req, res) => {
//   fs.readFile("./public/index.html", (err, data) => {
//     if (err) {
//       res.writeHead(500);
//       res.end("Error loading page");
//       return;
//     }

//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(data);
//   });
// });

const server = http.createServer((req, res) => {
  const files = {
    "/": { path: "./public/index.html", contentType: "text/html" },
    "/index.html": { path: "./public/index.html", contentType: "text/html" },
    "/script.js": {
      path: "./public/script.js",
      contentType: "text/javascript",
    },
  };
  const file = files[req.url];

  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  fs.readFile(file.path, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": file.contentType });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "system", text: `${username} joined` }),
      );
      console.log(`${username} joined`);
    }
  });

  socket.on("message", (message) => {
    const { username, text } = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "chat", username, text }));
        console.log(`{ type: "chat", ${username}, ${text} }`);
      }
    });
  });

  socket.on("close", () => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "system", text: `${username} left` }),
        );
        console.log(`${username} left`);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log("Chat server running at http:localhost:3001");
});
