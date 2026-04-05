"use client";

import { useState } from "react";
import BaseNode from "./BaseNode";

export default function ExtractNode() {
  const [timestamp, setTimestamp] = useState("0");

  return (
    <BaseNode
      title="Extract Frame"
      inputs={["video_url"]}
      outputs={["frame_image"]}
    >
      <input
        placeholder="Timestamp (sec or %)"
        className="w-full p-1 bg-black"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />
    </BaseNode>
  );
}