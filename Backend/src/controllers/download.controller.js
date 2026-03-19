const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

// 🔹 Shorts → watch fix
const normalizeUrl = (url) => {
  if (url.includes("shorts/")) {
    return url.replace("shorts/", "watch?v=");
  }
  return url;
};


// ================== GET VIDEO INFO ==================
const getVideoInfo = async (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL Required" });
  }

  url = normalizeUrl(url);

  try {
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-playlist \
      --no-check-certificate \
      --geo-bypass \
      --user-agent "Mozilla/5.0" \
      --extractor-args "youtube:player_client=android" \
      "${url}"`
    );

    const data = JSON.parse(stdout);

    res.status(200).json({
      title: data.title,
      channel: data.uploader,
      duration: data.duration_string,
      thumbnail: data.thumbnail || data.thumbnails?.[0]?.url || null,
    });

  } catch (err) {
    console.log("ERROR:", err.stderr || err);
    res.status(500).json({ message: "Could not fetch video info." });
  }
};


// ================== DOWNLOAD VIDEO ==================
const downloadVideo = async (req, res) => {
  let { url, format, quality } = req.query;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  url = normalizeUrl(url);

  try {
    const isAudio = format === "mp3";

    // 🔹 metadata fetch
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-playlist \
      --no-check-certificate \
      --geo-bypass \
      --user-agent "Mozilla/5.0" \
      --extractor-args "youtube:player_client=android" \
      "${url}"`
    );

    const data = JSON.parse(stdout);
    const safeTitle = data.title.replace(/[^\w\s-]/g, "").trim();

    // 🔹 headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle}.${format}"`
    );

    res.setHeader(
      "Content-Type",
      isAudio ? "audio/mpeg" : "video/mp4"
    );

    // 🔹 yt-dlp args
    const args = isAudio
      ? [
          "-f", "bestaudio",
          "--extract-audio",
          "--audio-format", "mp3",
          "--audio-quality", `${quality || 128}K`,
          "-o", "-",
          url,
        ]
      : [
          "-f", `best[height<=${quality || 720}]/best`,
          "-o", "-",
          url,
        ];

    // 🔹 spawn with flags
    const ytdlp = spawn("yt-dlp", [
      "--no-check-certificate",
      "--geo-bypass",
      "--user-agent", "Mozilla/5.0",
      "--extractor-args", "youtube:player_client=android",
      ...args
    ]);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (d) => {
      console.error("STDERR:", d.toString());
    });

    ytdlp.on("error", () => {
      res.status(500).json({ message: "Download failed." });
    });

  } catch (err) {
    console.log("ERROR:", err.stderr || err);
    res.status(500).json({ message: "Could not process download." });
  }
};


module.exports = { getVideoInfo, downloadVideo };