"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      let data = new FormData();
      for (const file of files) {
        data.append("file", file);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
        );
      }
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: data,
      });
      const imageResponse = await res.json();
      if (imageResponse.status === 200) {
        setImages((prev) => {
          return [...prev, imageResponse.uploadedImageData];
        });
      }
      setIsUploading(false);
    }
  }

  async function deleteImage(url) {
    const res = await fetch(`/api/upload/?url=${url}`, {
      method: "DELETE",
    });
    const deletedImageData = await res.json();
    if (deletedImageData.status === 200) {
      setImages((prev) => {
        return prev.filter((elem) => elem.secure_url !== url);
      });
    }
    fileInputRef.current.value = ""; // Reset the file input value
  }

  return (
    <div className="bg-slate-300 w-full h-screen flex justify-center">
      <div className="space-y-1 py-16">
        <div className="mb-2 flex flex-wrap gap-1">
          {!!images?.length &&
            images.map((elem) => (
              <div
                key={elem.asset_id}
                className="h-28 w-28 bg-white p-3 shadow-sm border border-gray-200 relative rounded-full"
              >
                <Image
                  src={elem.secure_url}
                  alt={elem.original_filename}
                  className="rounded-full"
                  width={120}
                  height={120}
                />
                <div
                  className="top-0 absolute right-0 cursor-pointer"
                  onClick={() => deleteImage(elem.secure_url)}
                >
                  <svg
                    height="24px"
                    id="Layer_1"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    version="1.1"
                    viewBox="0 0 512 512"
                    width="24px"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g>
                      <path d="M256,33C132.3,33,32,133.3,32,257c0,123.7,100.3,224,224,224c123.7,0,224-100.3,224-224C480,133.3,379.7,33,256,33z    M364.3,332.5c1.5,1.5,2.3,3.5,2.3,5.6c0,2.1-0.8,4.2-2.3,5.6l-21.6,21.7c-1.6,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3L256,289.8   l-75.4,75.7c-1.5,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3l-21.6-21.7c-1.5-1.5-2.3-3.5-2.3-5.6c0-2.1,0.8-4.2,2.3-5.6l75.7-76   l-75.9-75c-3.1-3.1-3.1-8.2,0-11.3l21.6-21.7c1.5-1.5,3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l75.7,74.7l75.7-74.7   c1.5-1.5,3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l21.6,21.7c3.1,3.1,3.1,8.2,0,11.3l-75.9,75L364.3,332.5z" />
                    </g>
                  </svg>
                </div>
              </div>
            ))}
          {isUploading && (
            <div className="h-24 flex items-center">
              <span className="loader"></span>
            </div>
          )}
          <label className="h-28 w-28 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary bg-white shadow-sm border border-primary rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z" />
              <circle cx={13} cy={14} r={3} />
              <path d="M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            </svg>
            <div>Upload Images</div>
            <input
              type="file"
              onChange={uploadImages}
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
