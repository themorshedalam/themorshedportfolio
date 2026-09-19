"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Video player that loads video as a blob to bypass iOS Safari
 * range request limitation on Cloudflare Workers.
 */
export function ProjectVideo({ src, caption }: { src: string; caption: string }) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let url: string;
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => {
        setBlobUrl(src);
      });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);

  useEffect(() => {
    if (blobUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [blobUrl]);

  return (
    <video
      ref={videoRef}
      src={blobUrl || undefined}
      controls
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
    />
  );
}
