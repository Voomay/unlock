const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".vcf": "text/vcard; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const safeUrl = decodeURIComponent(req.url.split("?")[0]);
  let routeFile = safeUrl === "/" ? "/home3.html" : safeUrl;
  if (routeFile === "/home2" || routeFile === "/homepage2") {
    routeFile = "/home2.html";
  } else if (routeFile === "/home3" || routeFile === "/homepage3") {
    routeFile = "/home3.html";
  } else if (routeFile === "/tours") {
    routeFile = "/tours.html";
  } else if (routeFile === "/about") {
    routeFile = "/about.html";
  } else if (routeFile === "/contact") {
    routeFile = "/contact.html";
  } else if (routeFile === "/travel-guide" || routeFile === "/blog") {
    routeFile = "/travel-guide.html";
  }
  let filePath = path.join(ROOT, routeFile);

  // Prevent directory traversal outside ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Unlock Cape Town Tours running at http://localhost:${PORT}`);
});
