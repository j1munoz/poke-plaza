
"use client";

import React, { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

interface ImageUploaderProps {
  maxNumber?: number;
}

export default function ImageUploader({ maxNumber = 69 }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageListType>([]);

  const onChange = (imageList: ImageListType, addUpdateIndex?: number[]) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div className="upload__wrapper">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Click or Drop here
            </button>
            <button
              onClick={onImageRemoveAll}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Remove all images
            </button>

            <div className="flex flex-wrap mt-4">
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex flex-col items-center w-1/3 mb-4"
                >
                  <img
                    src={image.dataURL}
                    alt=""
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="image-item__btn-wrapper mt-2 flex gap-2 text-sm  ">
                    <button
                      onClick={() => onImageUpdate(index)}
                      className="px-2 py-1 bg-yellow-400 rounded text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onImageRemove(index)}
                      className="px-2 py-1 bg-gray-700 rounded text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
