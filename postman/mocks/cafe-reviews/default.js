// eslint-disable-next-line @typescript-eslint/no-require-imports -- Postman handlers run as CommonJS.
const http = require("node:http");

// Matches ReviewsService.getMine: NestJS/Express sends null as an empty 200.
http.createServer((req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const ownReview = path.endsWith("/reviews/me");
  const cafeId = path.split("/")[2];
  if (!path.startsWith("/cafes/") || (!ownReview && !path.endsWith("/reviews"))) {
    res.writeHead(501).end();
    return;
  }
  res.setHeader("Content-Type", "application/json");
  if (ownReview && cafeId === "no-review") return res.end();
  if (ownReview && cafeId === "unauthorized") {
    res.writeHead(401).end('{"message":"Unauthorized"}');
    return;
  }
  if (ownReview && cafeId === "server-error") {
    res.writeHead(500).end('{"message":"Internal server error"}');
    return;
  }
  if (cafeId === "invalid-json") return res.end("{");
  const review = {
    id: "review-1", cafeId, rating: 5, content: "Good coffee",
    authorName: "Cafe Maps user", createdAt: "2026-10-23T00:00:00.000Z",
    updatedAt: "2026-10-23T00:00:00.000Z",
  };
  res.end(JSON.stringify(ownReview ? { ...review, isMine: true } : {
    data: [review],
    summary: { reviewCount: 1, ratingCount: 1, averageRating: 5 },
    meta: { total: 1, page: 1, limit: 3, totalPages: 1 },
  }));
}).listen(process.env.PORT);
