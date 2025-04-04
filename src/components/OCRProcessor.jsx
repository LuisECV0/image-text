import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { FaFileImage, FaPaste } from "react-icons/fa";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { franc } from "franc-min"; // Detecta idioma

const OCRProcessor = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detectedLang, setDetectedLang] = useState("");
    const [isDarkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );
    const [selectedLang, setSelectedLang] = useState("spa"); // Español por defecto

    // Lista de idiomas soportados
    const languages = {
        eng: "Inglés",
        spa: "Español",
        fra: "Francés",
        deu: "Alemán",
        ita: "Italiano",
        por: "Portugués",
        rus: "Ruso",
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDarkMode ? "dark" : "light"
        );
        localStorage.setItem("darkMode", isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = (checked) => setDarkMode(checked);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) processImage(file);
    };

    const processImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
        setText("");
        setDetectedLang(""); // Resetear idioma detectado
    };

    useEffect(() => {
        const handlePaste = (event) => {
            const items = event.clipboardData.items;
            for (let item of items) {
                if (item.type.startsWith("image")) {
                    const file = item.getAsFile();
                    processImage(file);
                }
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, []);

    const handleExtractText = () => {
        if (!image) return;
        setLoading(true);
        setText("Extrayendo texto...");

        Tesseract.recognize(image, selectedLang, { logger: (m) => console.log(m) })
            .then(({ data: { text } }) => {
                setText(text);
                setLoading(false);

                // Detectar idioma
                const detected = franc(text);
                setDetectedLang(languages[detected] || "Desconocido");
            });
    };

    return (
        <div className="ocr-processor">
            <DarkModeSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={40}
                style={{ marginBottom: "10px" }}
            />

            <h2 className="ocr-title">OCR: Extraer Texto de Imagen</h2>

            <label className="file-label">
                <FaFileImage size={20} />
                <span>Seleccionar Imagen</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />
            </label>

            <p className="paste-info">
                <FaPaste size={16} /> También puedes pegar una imagen (Ctrl + V)
            </p>

            {/* Selector de idioma */}
            <div className="language-selector">
                <label>Idioma del texto:</label>
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </div>

            {image && (
                <div className="preview-container">
                    <img src={image} alt="Vista previa" className="preview-image" />
                </div>
            )}

            <button className="ocr-button" onClick={handleExtractText} disabled={!image || loading}>
                {loading ? "Extrayendo..." : "Extraer Texto"}
            </button>

            {/* Mostrar resultado */}
            <div className="box-text">
                {text && (
                    <div className="extracted-text-container">
                        <p>{text}</p>
                        {detectedLang && (
                            <p className="detected-lang">Idioma detectado: <strong>{detectedLang}</strong></p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OCRProcessor;
