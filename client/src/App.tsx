import { useEffect, useState } from "react";

import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const [images, setImages] = useState([]);
  const PF = "http://localhost:3000/uploads/";
  const [selectedFile, setSelectedFile] = useState(null);
  const userexist = localStorage.getItem("user");
  const [user, setUser] = useState(JSON.parse(userexist));
  const navigate = useNavigate();

  const fetchApi = async () => {
    const res = await fetch("http://localhost:3000/images");

    const image = await res.json();

    setImages(image);
  };

  const handleLike = async (imageId) => {
    console.log(imageId);
    try {
      const response = await fetch(`http://localhost:3000/like/${imageId}`, {
        method: "PUT",
      });

      if (response.ok) {
        const updatedImages = images.map((image) => {
          if (image._id === imageId) {
            image.likes += 1;
          }
          return image;
        });
        setImages(updatedImages);
      } else {
        console.error("Failed to update likes for the image.");
      }
    } catch (error) {
      console.error("Error liking the image:", error);
    }
  };
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image!);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        refreshPage();
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/signup");
    } else {
      setUser(JSON.parse(user));
      fetchApi();
    }
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  const handleClick = () => {
    localStorage.removeItem("user");
    navigate("/signup");
  };

  return (
    <>
      <h1 className="text-3xl">Image Uploader </h1>
      <form onSubmit={onImageUpload} className="p-2 my-4">
        <input
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full border border-blue-600 hover:border-blue-700 cursor-pointer mx-4"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full border border-blue-600 hover:border-blue-700 cursor-pointer"
        >
          Upload Image
        </button>
      </form>

      <button
        onClick={handleClick}
        className="my-8 py-4 mx-4 absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold  px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-300"
      >
        Logout
      </button>

      {user && (
        <h1 className="text-2xl text-left mb-8">Hello, {user.username}</h1>
      )}

      <div className="flex flex-wrap gap-4 ">
        {images.map((image) => (
          <div key={image._id}>
            <img
              className="w-72 h-72 object-cover rounded-md mb-2"
              src={`${PF}${image.filename}`}
              alt={image.filename}
            />
            <h2 className="text-lg font-semibold">
              {image.likes}{" "}
              <button
                className="text-blue-500 hover:underline ml-2"
                onClick={() => handleLike(image._id)}
              >
                Like
              </button>
            </h2>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
