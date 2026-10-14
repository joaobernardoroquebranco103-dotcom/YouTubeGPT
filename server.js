// YouTubeGPT — minimal personal catalog addon
// Node.js 18+
// NOTE: This starter intentionally returns the official YouTube watch URL
// as the stream target. Some Nuvio/player builds may not play watch URLs
// directly; if that happens, the hosting/proxy strategy must be adapted.

const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const BASE = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

const videos = [
  {
    id: "ytgpt:live-from-mexico",
    name: "Dua Lipa: Live From Mexico",
    type: "movie",
    year: 2024,
    poster: "https://i.ytimg.com/vi/vZYVkitGXBU/maxresdefault.jpg",
    background: "https://i.ytimg.com/vi/vZYVkitGXBU/maxresdefault.jpg",
    description: "Official YouTube video — Dua Lipa: Live From Mexico.",
    youtubeId: "vZYVkitGXBU",
    youtubeUrl: "https://www.youtube.com/watch?v=vZYVkitGXBU"
  }
];

function json(res, data) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function notFound(res) {
  res.writeHead(404, {"Content-Type": "application/json"});
  res.end(JSON.stringify({error: "Not found"}));
}

function getVideo(id) {
  return videos.find(v => v.id === id);
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, BASE);
  const path = u.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    });
    return res.end();
  }

  if (path === "/manifest.json") {
    return json(res, {
      ...require("./manifest.json"),
      logo: `${BASE}/logo.png`
    });
  }

  if (path === "/logo.png") {
    res.writeHead(302, {"Location": "https://www.youtube.com/s/desktop/7f6c2f8f/img/favicon_144x144.png"});
    return res.end();
  }

  const metaMatch = path.match(/^\/meta\/movie\/(.+)\.json$/);
  if (metaMatch) {
    const video = getVideo(decodeURIComponent(metaMatch[1]));
    if (!video) return notFound(res);

    return json(res, {
      meta: {
        id: video.id,
        type: "movie",
        name: video.name,
        year: video.year,
        poster: video.poster,
        background: video.background,
        description: video.description,
        genres: ["Concert", "Music"]
      }
    });
  }

  const catalogMatch = path.match(/^\/catalog\/movie\/youtube\.json$/);
  if (catalogMatch) {
    return json(res, {
      metas: videos.map(v => ({
        id: v.id,
        type: "movie",
        name: v.name,
        poster: v.poster,
        year: v.year
      }))
    });
  }

  const streamMatch = path.match(/^\/stream\/movie\/(.+)\.json$/);
  if (streamMatch) {
    const video = getVideo(decodeURIComponent(streamMatch[1]));
    if (!video) return notFound(res);

    return json(res, {
      streams: [
        {
          name: "YouTubeGPT • Official YouTube",
          title: "Dua Lipa: Live From Mexico — YouTube",
          externalUrl: video.youtubeUrl
        }
      ]
    });
  }

  res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
  res.end("YouTubeGPT is running. Open /manifest.json");
});

server.listen(PORT, () => {
  console.log(`YouTubeGPT listening on ${BASE}`);
});
