import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import OCRProcessor from "./components/OCRProcessor";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import './components/styles.css';
function App() {
    const [image, setImage] = useState(null);

    return (
        <div className="container">
            <h2 className="title">OCR: Extraer Texto de Imagen</h2>
            <ImageUploader onImageUpload={setImage} />
            <OCRProcessor image={image} />
        </div>
    );
}

export default App;
