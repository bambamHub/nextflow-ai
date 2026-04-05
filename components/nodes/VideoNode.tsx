"use client";

import { useState } from "react";
import BaseNode from "./BaseNode";

export default function VideoNode() {
  const [video, setVideo] = useState<string | null>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideo(url);
  };

  return (
    <BaseNode title="Upload Video" outputs={["video_url"]}>
      <input type="file" accept="video/*" onChange={handleUpload} />

      {video && (
        <video controls className="mt-2 rounded max-h-32 w-full">
          <source src={video} />
        </video>
      )}
    </BaseNode>
  );
}