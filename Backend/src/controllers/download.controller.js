const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const fs = require('fs');
const path = require('path');
const os = require('os');

// Cookies file temporary banao
const getCookiesFile = () => {
  const cookiesContent = process.env.YOUTUBE_COOKIES;
  if (!cookiesContent) return null;
  const tmpPath = path.join(os.tmpdir(), 'yt_cookies.txt');
  fs.writeFileSync(tmpPath, cookiesContent);
  return tmpPath;
};

const getVideoInfo = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL Requires" });
  }

  try {
    const cookiesFile = getCookiesFile();
    const cookiesArg = cookiesFile ? `--cookies "${cookiesFile}"` : '';

    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-playlist ${cookiesArg} "${url}"`
    );
    const data = JSON.parse(stdout);

    res.status(200).json({
      title: data.title,
      channel: data.uploader,
      duration: data.duration_string,
      thumbnail: data.thumbnail || data.thumbnails?.[0]?.url || null,
    });
  } catch (err) {
    console.log("ERROR:", err);
    console.log("STDERR:", err.stderr);
    res.status(500).json({ message: "Could not fetch video info." });
  }
};

const downloadVideo = async (req, res) => {
  const { url, format, quality } = req.query;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  try {
    const isAudio = format === "mp3";
    const cookiesFile = getCookiesFile();
    const cookiesArg = cookiesFile ? `--cookies "${cookiesFile}"` : '';

    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-playlist ${cookiesArg} "${url}"`
    );
    const data = JSON.parse(stdout);
    const safeTitle = data.title.replace(/[^\w\s-]/g, "").trim();

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${format}"`);
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

    const args = isAudio
      ? ["-f", "bestaudio", "--extract-audio", "--audio-format", "mp3",
         "--audio-quality", `${quality}K`, "-o", "-", url]
      : ["-f", `best[height<=${quality}]/best`, "-o", "-", url];

    // cookies spawn mein bhi add karo
    const spawnArgs = cookiesFile
      ? ["--cookies", cookiesFile, ...args]
      : args;

    const ytdlp = spawn("yt-dlp", spawnArgs);
    ytdlp.stdout.pipe(res);
    ytdlp.stderr.on("data", (d) => console.error(d.toString()));
    ytdlp.on("error", () => res.status(500).json({ message: "Download failed." }));

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Could not process download." });
  }
};

module.exports = { getVideoInfo, downloadVideo };