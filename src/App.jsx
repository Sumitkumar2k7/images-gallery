import React, { useEffect, useState } from 'react';
import 'animate.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'remixicon/fonts/remixicon.css';
import "react-toastify/dist/ReactToastify.css";

const API_KEY = "q8eOojN5lu7gZEFj1gImbGSyKUrOjfbkApKOgDtyZEZ0yP8MK8OM52A1";

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("nature");

  // Fetch Images from Pexels API
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=12`,
        { headers: { Authorization: API_KEY } }
      );

      if (res.data.photos.length === 0 && page === 1) {
        toast.error("No images found for this keyword.");
      }

      setPhotos(prev => [...prev, ...res.data.photos]);
    } catch (err) {
      toast.error("Error fetching images");
    }
    setLoading(false);
  };

  // Search Handler
  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (!q) return;
    setPhotos([]);
    setPage(1);
    setQuery(q);
  };

  // Load More Images
  const loadMore = () => setPage(prev => prev + 1);

  // Download Image
  const downloadImage = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blobURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch ( err ) {
      toast.error("Download failed!");
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, query]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 gap-12 animate__animated animate__fadeIn">

      <h1 className="text-4xl font-bold text-indigo-600">
        📷 Image Gallery – {query}
      </h1>

      <form onSubmit={handleSearch} className="flex w-11/12 max-w-2xl">
        <input
          name="search"
          className="p-3 bg-white rounded-l-lg w-full focus:outline-indigo-600"
          placeholder="Search image here..."
          required
        />
        <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-r-lg hover:scale-105 transition-transform">
          Search
        </button>
      </form>

      {photos.length === 0 && !loading && (
        <h2 className="text-2xl font-semibold text-gray-600">
          No images found.
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-11/12">
        {photos.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow">
            <img
              src={item.src.medium}
              alt={item.alt}
              className="rounded-t-xl h-[190px] w-full object-cover hover:scale-110 transition-transform duration-300"
            />
            <div className="p-3">
              <h1 className="text-lg text-gray-700 font-medium capitalize">
                {item.photographer}
              </h1>

              <button
                onClick={() => downloadImage(item.src.original)}
                className="mt-3 block bg-green-500 font-bold py-2 rounded-lg text-center hover:scale-105 transition-transform duration-300 w-full"
              >
                <i className="ri-download-line mr-1"></i> Download
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="col-span-full flex justify-center">
            <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin"></i>
          </div>
        )}

        {photos.length > 0 && !loading && (
          <div className="col-span-full flex justify-center">
            <button
              onClick={loadMore}
              className="bg-rose-500 py-3 px-16 rounded-lg font-medium text-white hover:scale-110 transition-transform"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
