import { Upload } from "@mui/icons-material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "../supabase";

export default function Players() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div>
        <Outlet />
        {showModal && <Modal setShowModal={setShowModal} />}
        <div className="my-20 mx-60">
          <h2 className="text-4xl font-semibold text-center">Players</h2>
          <p className="text-2xl font-semibold text-center my-4">
            Please enter your players
          </p>
          <button
            className="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            <svg
              className="w-12 h-12 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const Modal = ({ setShowModal }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const UploadImage = () => {
    
  }
  return (
    <div className="fixed inset-0 bg-[#231F20] bg-opacity-60 flex items-center justify-center z-40">
      <div className="flex flex-col items-center justify-center w-2/5 border-2 bg-[#231F20] dark:border-gray-600 rounded-lg z-50 p-8">
        <button
          className="self-end text-gray-500 dark:text-gray-400"
          onClick={() => setShowModal(false)}
        >
          <svg
            class="w-12 h-12 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <div>
          {previewImage !== null ? (
            <div className="w-80 h-80 rounded-full overflow-hidden my-8">
              <img
                src={previewImage}
                alt="preview"
                className="w-80 h-80 object-cover rounded-lg"
              />
            </div>
          ) : (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-80 h-80 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Player Name"
            className="w-96 h-12 mb-8 px-4 border-2 border-gray-300 rounded-lg dark:bg-[#231F20] dark:border-gray-600"
          />
        </div>
        {previewImage && (
          <div>
            <button className="w-96 h-12 mb-4 bg-gray-500 text-white rounded-lg hover:bg-white hover:text-gray-800 text-lg font-semibold" onClick={UploadImage}>
              Add Player
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
