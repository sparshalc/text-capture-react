import { useCallback, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if(!selectedImage) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(selectedImage);
    setTextResult(data.text);
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText])

  const handleChangeImage = e => {
    if(e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult("")
    }
  }
  const clearSelection = () => {
    setSelectedImage(null);
    setTextResult("")
  }

  const copySelection = () =>{
     const mainPara = textResult;
     navigator.clipboard.writeText(mainPara);
  }

  return (
    <div className="App">
      <h1>TextCaptureReact</h1>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input hidden type="file" id="upload" accept='image/*' onChange={handleChangeImage} />
        <button onClick={copySelection} className={textResult.length>0 ? 'copy' : 'hide'}>Copy</button>
        <button onClick={clearSelection}>Clear</button>
      </div>

      <div className="result">
        {selectedImage && (
          <div className="box-image">
            <img src={URL.createObjectURL(selectedImage)} />
          </div>
        )}
        {textResult && (
          <div className="box-p">
            <p>{textResult}</p>
          </div>
        )}
      </div>

      <div className="footer">
                <p id="tip"> 📌 <span> Image Processing </span> may take a while! </p>
      </div>
    </div>
  );
}

export default App;


