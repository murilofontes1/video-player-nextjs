"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const playlist = [
    { title: "Vídeo 1", src: "/sample1.mp4" },
    { title: "Vídeo 2", src: "/sample2.mp4" },
    { title: "Vídeo 3", src: "/sample3.mp4" },
  ];

  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [filter, setFilter] = useState("none");

  // volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // autoplay ao trocar vídeo
  useEffect(() => {
    if (!videoRef.current) return;

    const playPromise = videoRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setPlaying(false);
      });
    }

    setPlaying(true);
  }, [currentTrack]);

  const playPause = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const previousTrack = () => {
    setCurrentTrack(
      (prev) => (prev - 1 + playlist.length) % playlist.length
    );
  };

  const forward10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const backward10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const changeTime = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
    setCurrentTime(value);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filters: Record<string, string> = {
    none: "none",
    red: "sepia(1) saturate(8) hue-rotate(-20deg)",
    blue: "sepia(1) saturate(8) hue-rotate(180deg)",
    green: "sepia(1) saturate(8) hue-rotate(90deg)",
    gray: "grayscale(1)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "600px",
          background: "#111827",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#38bdf8" }}>
          🎬 Player de Vídeo
        </h1>

        {/* VIDEO */}
        <video
          ref={videoRef}
          src={playlist[currentTrack].src}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginTop: "10px",
            filter: filters[filter],
          }}
          onLoadedMetadata={() =>
            setDuration(videoRef.current?.duration || 0)
          }
          onTimeUpdate={() =>
            setCurrentTime(videoRef.current?.currentTime || 0)
          }
          onEnded={nextTrack}
        />

        {/* INFO */}
        <h3 style={{ textAlign: "center", marginTop: 10 }}>
          Tocando:{" "}
          <span style={{ color: "#22c55e" }}>
            {playlist[currentTrack].title}
          </span>
        </h3>

        {/* PLAYLIST */}
        <div style={{ marginTop: 15 }}>
          {playlist.map((video, index) => (
            <div
              key={index}
              onClick={() => setCurrentTrack(index)}
              style={{
                padding: "10px",
                marginBottom: "6px",
                borderRadius: "8px",
                cursor: "pointer",
                background:
                  currentTrack === index ? "#2563eb" : "#1f2937",
              }}
            >
              {video.title}
            </div>
          ))}
        </div>

        {/* CONTROLES */}
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <button onClick={previousTrack} style={btn}>
            ⏮
          </button>

          <button onClick={playPause} style={{ ...btn, margin: "0 10px" }}>
            {playing ? "⏸" : "▶"}
          </button>

          <button onClick={nextTrack} style={btn}>
            ⏭
          </button>
        </div>

        {/* 10s */}
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <button onClick={backward10} style={smallBtn}>
            ⏪ 10s
          </button>

          <button onClick={forward10} style={{ ...smallBtn, marginLeft: 10 }}>
            10s ⏩
          </button>
        </div>

        {/* TEMPO */}
        <div style={{ marginTop: 15 }}>
          <p style={{ textAlign: "center" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => changeTime(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* VOLUME */}
        <div style={{ marginTop: 15 }}>
          <p style={{ textAlign: "center" }}>Volume: {volume}%</p>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* 🎨 FILTROS DE COR */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <p>Filtros de cor:</p>

          <button onClick={() => setFilter("none")} style={btn2}>
            Normal
          </button>

          <button onClick={() => setFilter("red")} style={btn2}>
            Vermelho
          </button>

          <button onClick={() => setFilter("blue")} style={btn2}>
            Azul
          </button>

          <button onClick={() => setFilter("green")} style={btn2}>
            Verde
          </button>

          <button onClick={() => setFilter("gray")} style={btn2}>
            Cinza
          </button>
        </div>
      </div>
    </main>
  );
}

// estilos
const btn = {
  padding: "10px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const smallBtn = {
  padding: "8px 12px",
  background: "#374151",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const btn2 = {
  margin: "5px",
  padding: "8px 10px",
  background: "#1f2937",
  color: "#fff",
  border: "1px solid #374151",
  borderRadius: "6px",
  cursor: "pointer",
};