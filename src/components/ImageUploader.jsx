import { useState } from "react";

const ImageUploader = ({ onImageUpload }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreview(imageURL);
            onImageUpload(imageURL);
        }
    };

    return (
        <div className="image-uploader">
            {preview && <img src={preview} alt="Vista previa" className="preview-image" />}
        </div>
    );
};

export default ImageUploader;
