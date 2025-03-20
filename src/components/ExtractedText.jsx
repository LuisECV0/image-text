const ExtractedText = ({ text }) => {
    if (!text) return null;
    
    return (
        <div className="extracted-text">
            <h5>Texto Extraído:</h5>
            <p>{text}</p>
        </div>
    );
};

export default ExtractedText;
