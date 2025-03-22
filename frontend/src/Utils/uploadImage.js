import { API_PATH } from "./apipath";
import axiosInstance from "./axiosinstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  try {
    const response = await axiosInstance.post(
      API_PATH.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.imageUrl;
} catch (error) {
    if (error.response) {
      console.error("Image Upload Failed:", error.response.data);
      throw new Error(error.response.data?.message || "Image upload failed.");
    } else if (error.request) {
      throw new Error("No response from the server. Check your network.");
    } else {
      throw new Error("Unexpected error occurred during upload.");
    }
  }
  
};

export default uploadImage;
