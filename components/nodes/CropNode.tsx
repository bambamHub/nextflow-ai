"use client";

import { useState } from "react";
import BaseNode from "./BaseNode";

export default function CropNode() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <BaseNode
      title="Crop Image"
      inputs={["image_url"]}
      outputs={["cropped_image"]}
    >
      <input
        type="number"
        placeholder="X %"
        className="w-full mb-1 p-1 bg-black"
        onChange={(e) => setX(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Y %"
        className="w-full p-1 bg-black"
        onChange={(e) => setY(Number(e.target.value))}
      />
    </BaseNode>
  );
}