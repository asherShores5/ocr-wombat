// src/components/OCRTool.tsx
import React, { useState, useRef } from 'react';
import { Clipboard, ClipboardCheck, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './Button';

export const OCRTool = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [noTextFound, setNoTextFound] = useState(false);
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  const processImageBlob = (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setImageData(result);
      await performOCR(blob);
    };
    reader.readAsDataURL(blob);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (!blob) continue;
        processImageBlob(blob);
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageBlob(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageBlob(file);
  };

  const performOCR = async (imageBlob: Blob) => {
    setIsLoading(true);
    setOcrText('');
    setNoTextFound(false);
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
        body: formData,
      });

      const data = await response.json();
      const parsed = data.ParsedResults?.[0]?.ParsedText?.trim();
      if (parsed) {
        setOcrText(parsed);
      } else {
        setOcrText('');
        setNoTextFound(true);
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    setImageData(null);
    setOcrText('');
    setNoTextFound(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md" />
          <img
            src="/ocr-wombat.png"
            alt="OCR Wombat"
            className="relative w-16 h-16 object-contain rounded-xl"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">OCR Wombat</h1>
          <p className="text-sm text-gray-400 mt-0.5">Paste or drop an image to extract text</p>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border border-white/[0.07] bg-gray-900/80 shadow-2xl"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Paste / Drop zone */}
        <div className="p-6">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <div
            ref={pasteZoneRef}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => pasteZoneRef.current?.focus()}
            tabIndex={0}
            className={[
              'relative min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 outline-none',
              isDragOver
                ? 'border-amber-500/70 bg-amber-500/5'
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/40 hover:bg-gray-800/60',
              'focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10',
            ].join(' ')}
          >
            {imageData ? (
              <>
                <img
                  src={imageData}
                  alt="Pasted content"
                  className="max-h-52 object-contain rounded-lg"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-900/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear image"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center space-y-3 px-6 select-none">
                <div className="w-14 h-14 mx-auto rounded-full bg-gray-700/60 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Paste a screenshot</p>
                  <p className="text-gray-500 text-sm mt-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 text-xs font-mono">Ctrl+V</kbd>
                    {' '}· drag & drop · or{' '}
                    <label
                      htmlFor="file-input"
                      className="text-amber-400 hover:text-amber-300 cursor-pointer underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      browse
                    </label>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mx-6" />

        {/* Output area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-400 loading-pulse">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-500/70"
                    style={{ animation: `pulse-ring 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
              <span className="text-sm">Extracting text…</span>
            </div>
          ) : ocrText ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Extracted Text
                </h3>
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? 'success' : 'outline'}
                  className="flex items-center gap-2 text-sm"
                >
                  {copied ? (
                    <><ClipboardCheck className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Clipboard className="w-4 h-4" /> Copy</>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-gray-800/60 rounded-xl border border-white/[0.06] whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-mono">
                {ocrText}
              </div>
            </div>
          ) : noTextFound ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400/80">
              <ImageIcon className="w-5 h-5 shrink-0" />
              <p className="text-sm">No text found in this image.</p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-2">
              Extracted text will appear here
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-600 text-xs mt-6">
        Powered by{' '}
        <a
          href="https://ocr.space"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-amber-400 transition-colors"
        >
          OCR.space
        </a>
      </p>
    </div>
  );
};
