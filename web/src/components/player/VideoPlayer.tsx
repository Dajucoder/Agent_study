import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  /** 续播起点（秒） */
  startSeconds?: number;
  /** 播放进度回调（已做节流，约每 3 秒一次） */
  onProgress?: (seconds: number) => void;
  onEnded?: () => void;
}

export function VideoPlayer({ src, title, startSeconds = 0, onProgress, onEnded }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastReported = useRef(0);

  // 续播：元数据加载后跳到上次位置
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onLoaded = () => {
      if (startSeconds > 0 && v.duration > startSeconds) {
        v.currentTime = startSeconds;
      }
    };
    v.addEventListener('loadedmetadata', onLoaded);
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [startSeconds, src]);

  const handleTimeUpdate = () => {
    const v = ref.current;
    if (!v || !onProgress) return;
    const t = v.currentTime;
    if (Math.abs(t - lastReported.current) >= 3) {
      lastReported.current = t;
      onProgress(t);
    }
  };

  return (
    <div className="video-player">
      <video
        ref={ref}
        className="video-player__el"
        controls
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (onProgress) onProgress(ref.current?.duration ?? 0);
          onEnded?.();
        }}
      >
        <source src={src} type="video/mp4" />
        您的浏览器不支持 HTML5 视频播放。
      </video>
      <p className="video-player__caption">{title}</p>
    </div>
  );
}
