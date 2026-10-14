# YouTubeGPT

A small Nuvio/Stremio-style addon starter for official YouTube videos.

## Included
- Catalog: YouTubeGPT
- First item: Dua Lipa — Live From Mexico
- Official YouTube URL: https://www.youtube.com/watch?v=vZYVkitGXBU
- Add more videos by editing `videos` in `server.js`.

## Run locally
Requires Node.js 18+.

```bash
npm start
```

Then open:
http://localhost:3000/manifest.json

## Important playback note
This first version deliberately returns the official YouTube watch URL as an
`externalUrl`. Whether Nuvio 0.4.14 can play/launch that URL depends on its
current player behavior. It does NOT download or extract the YouTube video.

## Hosting
For Nuvio to reach the addon from your phone, deploy this project to a public
HTTPS Node.js host and use its `/manifest.json` URL when installing the addon.
