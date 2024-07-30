const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Image uploaded successfully:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Audio uploaded successfully:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading the audio:", error);
    throw error;
  }
};

export { uploadImage, uploadAudio };
