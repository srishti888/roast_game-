import React from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

interface IntelUploaderProps {
  onScreenshotUploaded: (url: string) => void;
  onPenaltyAccepted: () => void;
}

const IntelUploader: React.FC<IntelUploaderProps> = ({ onScreenshotUploaded, onPenaltyAccepted }) => {
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `screenshots/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Play shutter sound
      const audio = new Audio('/sounds/shutter.mp3');
      audio.volume = 1.0;
      try {
        await audio.play();
      } catch (err) {
        console.warn("Shutter sound error:", err);
      }

      onScreenshotUploaded(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const storageRef = ref(storage, `screenshots/${Date.now()}-pasted.png`);
              await uploadBytes(storageRef, file);
              await getDownloadURL(storageRef);

              // Play shutter sound
              const audio = new Audio('/sounds/shutter.mp3');
              audio.volume = 1.0;
              try {
                await audio.play();
              } catch (err) {
                console.warn("Shutter sound error:", err);
              }

              onScreenshotUploaded(e.target?.result as string);
            } catch (error) {
              console.error("Paste upload error:", error);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onPaste={handlePaste} 
        className="p-5 bg-war-dark border-2 border-dashed border-war-orange/50 rounded cursor-pointer hover:bg-war-charcoal transition-colors"
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-war-orange text-xs font-mono mb-2 animate-pulse">CLASSIFIED INTEL REQUIRED</div>
          <div className="text-war-gray">Paste screenshot (Ctrl+V)</div>
          <div className="mt-2 text-war-orange text-2xl">📋</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-war-gray text-sm">
        <span className="flex-1 h-[1px] bg-war-gray/30"></span>
        <span className="font-mono">OR</span>
        <span className="flex-1 h-[1px] bg-war-gray/30"></span>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label 
            htmlFor="file-upload" 
            className="flex items-center justify-center gap-2 p-2 bg-war-blue/70 text-white rounded cursor-pointer hover:bg-war-blue transition-colors text-center"
          >
            <span className="font-mono text-sm">Upload File</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <button 
            onClick={onPenaltyAccepted}
            className="w-full p-2 bg-war-red/70 text-white rounded hover:bg-war-red transition-colors font-mono text-sm"
          >
            Accept -10 Penalty
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelUploader;
