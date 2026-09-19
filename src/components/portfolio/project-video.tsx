"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Video player with smart loading:
 * 1. Try direct URL first (works on desktop — instant playback)
 * 2. If direct URL fails (iOS/Cloudflare), fetch as blob
 * 3. Show loading spinner while blob downloads
 */
export function ProjectVideo({ src, caption }: { src: string; caption: string }) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [useBlob, setUseBlob] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect iOS/Safari — these need blob approach
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      // iOS/Safari: fetch as blob to bypass range request issue
      setUseBlob(true);
      let url: string;
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        })
        .catch(() => {
          setBlobUrl(src);
          setLoading(false);
        });
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      // Desktop/Chrome/Firefox: use direct URL (supports range requests)
      setUseBlob(false);
      setLoading(false);
    }
  }, [src]);

  useEffect(() => {
    // Don't autoplay — user clicks play manually
  }, [loading, blobUrl]);

  const videoSrc = useBlob ? (blobUrl || undefined) : src;

  return (
    <div className="relative">
      {loading && (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-[var(--rule)] bg-[var(--cream-soft)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-full border-2 border-[var(--rule)] border-t-foreground"
          />
        </div>
      )}
      {!loading && (
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          playsInline
          preload="auto"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="block w-full h-auto rounded-2xl border border-[var(--rule)]"
        />
      )}
    </div>
  );
}
