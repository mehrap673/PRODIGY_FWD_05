import { useState } from 'react';
import { FaImage, FaVideo } from 'react-icons/fa';

const MediaUpload = ({ onFilesSelected }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video'
    }));
    setPreviews(newPreviews);
  };

  return (
    <div className="media-upload">
      <input
        type="file"
        id="media-input"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="media-input" className="media-upload-btn">
        <FaImage /> <FaVideo /> Add Photos/Videos
      </label>
      
      {previews.length > 0 && (
        <div className="media-previews">
          {previews.map((preview, index) => (
            <div key={index} className="media-preview">
              {preview.type === 'image' ? (
                <img src={preview.url} alt={`Preview ${index}`} />
              ) : (
                <video src={preview.url} controls />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
