import React, { useState } from 'react';
import axios from 'axios';

const Main = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = '9icUZsXHZ1JawutscAffp35o';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedImage(null); // Reset processed image on new upload
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': API_KEY,
          },
          responseType: 'blob',
        }
      );

      console.log("API response received:", response);

      if (response.status === 200) {
        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setProcessedImage(imageUrl);
        console.log("Image URL:", imageUrl);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' text-center flex justify-center items-center flex-col gap-6'>
      <h1 className=' text-slate-500 text-5xl'>Background Remover</h1>
      <input className=''  type="file" accept="image/*" onChange={handleFileChange} />
      <button className=' px-3 py-2 text-white  bg-slate-500 rounded-md text-center' onClick={handleRemoveBackground} disabled={loading}>
        {loading ? 'Processing...' : 'upload Image'}
      </button>
      {processedImage && (
        <div >
          <h2>Processed Image</h2>
          <img src={processedImage} alt="Processed" />
          <br />
          <a href={processedImage} download="processed-image.png">
            <button className=' px-3 py-2 bg-slate-500  text-white rounded-md text-center'>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Main;
