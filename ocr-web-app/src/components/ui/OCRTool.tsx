// src/components/OCRTool.tsx
import React, { useState, useRef } from 'react';
import { Clipboard, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

export const OCRTool = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (!blob) continue;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          setImageData(result);
          await performOCR(blob);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  const performOCR = async (imageBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageBlob);
      
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'K85423828488957' // Replace with your actual API key
            // I had AI generate this portion and it generated a working API key
            // I'm leaving it in hardcoded because I find that funny
            // Sorry to whoever's key this is   
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.ParsedResults?.[0]) {
        setOcrText(data.ParsedResults[0].ParsedText);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrText('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ocrText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Image to Text OCR Tool</h1>
        </div>
        
        <div
          ref={pasteZoneRef}
          onPaste={handlePaste}
          className="min-h-[200px] p-4 border-2 border-gray-700 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors"
          onClick={() => pasteZoneRef.current?.focus()}
          tabIndex={0}
        >
          {imageData ? (
            <img 
              src={imageData} 
              alt="Pasted content" 
              className="max-h-48 object-contain"
            />
          ) : (
            <div className="text-center space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-500" />
              <p className="text-gray-400">Paste your screenshot here (Ctrl+V)</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center mt-4 text-gray-400">
            Processing image...
          </div>
        )}

        {ocrText && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-200">Extracted Text</h3>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Clipboard className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg whitespace-pre-wrap border border-gray-700 text-gray-200">
              {ocrText}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}