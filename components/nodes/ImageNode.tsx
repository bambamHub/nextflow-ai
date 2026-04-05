"use client";

import { useState } from "react";
import BaseNode from "./BaseNode";

export default function ImageNode() {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <BaseNode title="Upload Image" outputs={["image_url"]}>
      <input type="file" accept="image/*" onChange={handleUpload} />

      {image && (
        <img src={image} className="mt-2 rounded max-h-32 w-full object-cover" />
      )}
    </BaseNode>
  );
}