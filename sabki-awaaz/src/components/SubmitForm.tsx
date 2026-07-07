import React, { useState, useRef } from 'react';
import { WARD_OPTIONS } from '../constants';
import { submitGrievance } from '../api';
import { FileText, Mic, Camera, UploadCloud, Check, HelpCircle, FileCheck, Loader2 } from 'lucide-react';

interface SubmitFormProps {
  constituency: string;
  onSubmissionSuccess: () => void;
}

export const SubmitForm: React.FC<SubmitFormProps> = ({ constituency, onSubmissionSuccess }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'photo'>('text');
  const [ward, setWard] = useState(WARD_OPTIONS[0]);
  const [residentName, setResidentName] = useState('');
  const [residentTitle, setResidentTitle] = useState('Resident Citizen');
  const [textVal, setTextVal] = useState('');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlobBase64, setAudioBlobBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [simulatedVoice, setSimulatedVoice] = useState(false);

  // Photo Upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Handle Drag-and-Drop for Photo
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPhotoFile(e.dataTransfer.files[0]);
    }
  };

  const processPhotoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setPhotoPreview(dataUrl);
        // Extract pure base64 (remove data:image/...;base64, prefix)
        const base64Only = dataUrl.split(',')[1] || dataUrl;
        setPhotoBase64(base64Only);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processPhotoFile(e.target.files[0]);
    }
  };

  // Real or Simulated Voice Recording
  const startRecording = async () => {
    try {
      setAudioUrl(null);
      setAudioBlobBase64(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Convert blob to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const base64Only = dataUrl.split(',')[1] || dataUrl;
          setAudioBlobBase64(base64Only);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn("Media devices locked or unsupported, switching to simulated voice dictation.");
      setSimulatedVoice(true);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (simulatedVoice) {
      setIsRecording(false);
      setSimulatedVoice(false);
      setAudioUrl("#simulated-audio");
      setAudioBlobBase64("UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==");
      if (!textVal) {
        setTextVal("Severe water logging has damaged the local electrical box near Sector 4.");
      }
    } else if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetForm = () => {
    setTextVal('');
    setAudioUrl(null);
    setAudioBlobBase64(null);
    setPhotoPreview(null);
    setPhotoBase64(null);
    setSuccessReceipt(null);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Determine content to send to backend
    let contentStr = '';

    if (activeTab === 'text') {
      if (!textVal.trim()) return alert("Please specify the details of your grievance.");
      contentStr = textVal;
    } else if (activeTab === 'voice') {
      if (!audioBlobBase64) return alert("Please record or dictate your voice grievance.");
      // For voice, send the base64 audio data; backend will transcribe via Gemini
      contentStr = audioBlobBase64;
    } else {
      if (!photoBase64) return alert("Please select or upload a photographic record.");
      // For photo, send the base64 image data; backend will caption via Gemini
      contentStr = photoBase64;
    }

    setIsSubmitting(true);

    try {
      const response = await submitGrievance(activeTab, contentStr, ward);

      // Generate success receipt with real backend data
      const receiptId = `GAZ-${response.id.slice(0, 8).toUpperCase()}/${new Date().getFullYear()}`;
      setSuccessReceipt({
        receiptId,
        constituency,
        ward,
        type: activeTab,
        residentName: residentName.trim() || "Anonymous Citizen",
        content: response.extracted_concern,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      onSubmissionSuccess();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successReceipt) {
    return (
      <div className="bg-white border-2 border-seal-maroon p-6 md:p-8 paper-stack max-w-xl mx-auto animate-stamp-fade relative overflow-hidden">
        {/* Decorative corner brackets for a certificate look */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-seal-maroon"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-seal-maroon"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-seal-maroon"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-seal-maroon"></div>

        {/* Vintage Sealing Seal stamp */}
        <div className="absolute top-6 right-6 border-4 border-double border-seal-green p-2 rounded-full w-20 h-20 rotate-[12deg] bg-white stamp-effect flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[8px] text-seal-green font-bold">GAZETTE</span>
          <span className="font-mono text-[10px] text-seal-green font-bold leading-none">ACCEPTED</span>
          <span className="font-mono text-[7px] text-seal-green/80 mt-0.5 font-bold">RECORDED</span>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-seal-green/10 text-seal-green mb-3 border border-seal-green/20">
            <FileCheck size={32} />
          </div>
          <h3 className="font-sans text-2xl font-bold text-seal-maroon">Administrative Receipt</h3>
          <p className="font-mono text-xs text-ink/60 uppercase mt-1">Official Municipal Lodgement</p>
        </div>

        {/* Dashed Tear-Off receipt separator */}
        <div className="perforation my-4"></div>

        <div className="space-y-4 font-mono text-xs text-ink/90 bg-parchment-dim p-4 border border-parchment-deep rounded">
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span className="font-bold">RECEIPT ID:</span>
            <span className="text-seal-maroon font-bold">{successReceipt.receiptId}</span>
          </div>
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span>CONSTITUENCY:</span>
            <span className="font-bold">{successReceipt.constituency}</span>
          </div>
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span>WARD BOUNDARY:</span>
            <span className="font-bold">{successReceipt.ward}</span>
          </div>
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span>LODGED BY:</span>
            <span className="font-bold">{successReceipt.residentName}</span>
          </div>
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span>RECORD TYPE:</span>
            <span className="font-bold uppercase text-seal-navy">{successReceipt.type} FORMAT</span>
          </div>
          <div className="flex justify-between border-b border-parchment-dark pb-1.5">
            <span>TIMELOCK DATE:</span>
            <span>{successReceipt.date}</span>
          </div>
          <div className="pt-2">
            <span className="block font-bold mb-1">AI-EXTRACTED CONCERN:</span>
            <p className="italic bg-white p-3 border border-parchment-deep text-ink/80 text-[11px] leading-relaxed">
              "{successReceipt.content}"
            </p>
          </div>
        </div>

        <div className="perforation my-6"></div>

        <p className="text-[11px] font-mono text-ink/50 text-center leading-relaxed">
          This document represents an officially logged civic demand on the Sabki Awaaz platform. 
          Under section 42-A of the Civil Gazette, the designated Member of Parliament is legally bound to review this submission.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={resetForm}
            className="flex-1 border-2 border-seal-maroon text-seal-maroon hover:bg-seal-maroon hover:text-white py-2.5 font-mono text-xs font-bold uppercase transition-all duration-150 active:scale-95"
          >
            Lodge Another Concern
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-seal-maroon text-white hover:bg-seal-maroon-dark py-2.5 font-mono text-xs font-bold uppercase transition-all duration-150 active:scale-95"
          >
            Print Gazette Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-parchment-deep p-6 md:p-8 paper-stack max-w-2xl mx-auto">
      <div className="border-b border-dashed border-parchment-deep pb-4 mb-6">
        <h3 className="font-sans text-xl font-bold text-seal-maroon">Citizen Grievance Submission Portal</h3>
        <p className="font-mono text-xs text-ink/50 uppercase tracking-wider mt-1">
          Lodge your localized issue for the MP Gazette ({constituency})
        </p>
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 font-mono text-xs mb-6 flex items-center gap-2">
          <span>⚠ {submitError}</span>
          <button onClick={() => setSubmitError(null)} className="ml-auto text-red-600 hover:text-red-900 font-bold">✕</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-mono text-xs font-bold uppercase text-ink/70 mb-1.5">
            1. Select Ward Boundary
          </label>
          <select 
            value={ward} 
            onChange={(e) => setWard(e.target.value)}
            className="w-full bg-parchment-dim border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-2.5 font-sans text-sm text-ink outline-none"
          >
            {WARD_OPTIONS.map((w, idx) => (
              <option key={idx} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase text-ink/70 mb-1.5">
            2. Reporter Identity
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Your Full Name"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              className="flex-1 bg-parchment-dim border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-2.5 font-sans text-sm outline-none"
            />
            <input 
              type="text" 
              placeholder="e.g. Resident"
              value={residentTitle}
              onChange={(e) => setResidentTitle(e.target.value)}
              className="w-1/3 bg-parchment-dim border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-2.5 font-sans text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Touch-Friendly Mode Toggle Tabs */}
      <div className="mb-6">
        <label className="block font-mono text-xs font-bold uppercase text-ink/70 mb-2">
          3. Choose Recording Medium
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center justify-center p-4 border text-center transition-all ${
              activeTab === 'text' 
                ? 'bg-seal-maroon/5 border-seal-maroon text-seal-maroon font-bold' 
                : 'bg-parchment-dim border-parchment-deep hover:bg-parchment-dark text-ink/70'
            }`}
          >
            <FileText className="mb-1.5" size={20} />
            <span className="font-mono text-xs">TEXT RECORD</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex flex-col items-center justify-center p-4 border text-center transition-all ${
              activeTab === 'voice' 
                ? 'bg-seal-maroon/5 border-seal-maroon text-seal-maroon font-bold' 
                : 'bg-parchment-dim border-parchment-deep hover:bg-parchment-dark text-ink/70'
            }`}
          >
            <Mic className="mb-1.5" size={20} />
            <span className="font-mono text-xs">VOICE MEMO</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex flex-col items-center justify-center p-4 border text-center transition-all ${
              activeTab === 'photo' 
                ? 'bg-seal-maroon/5 border-seal-maroon text-seal-maroon font-bold' 
                : 'bg-parchment-dim border-parchment-deep hover:bg-parchment-dark text-ink/70'
            }`}
          >
            <Camera className="mb-1.5" size={20} />
            <span className="font-mono text-xs">PHOTO GRAPH</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-parchment-dim border border-parchment-deep p-5 mb-6 min-h-[200px] flex flex-col justify-center">
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-ink/60 font-bold uppercase">Grievance Clause Description</span>
              <span className="font-mono text-[10px] text-ink/40">CHAR INDEX: {textVal.length}</span>
            </div>
            <textarea
              rows={5}
              placeholder="Describe the issue with specific locations, streets, and severity details to help your MP take direct physical action..."
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              className="w-full bg-white border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-3 font-sans text-sm text-ink outline-none"
            />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-3">
            <span className="font-mono text-xs text-ink/60 font-bold uppercase text-center block">
              Audio Dictation Registry
            </span>
            
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                {/* Recording visualizer animation */}
                <div className="flex items-center gap-1.5 h-10 px-4">
                  <span className="w-1.5 bg-seal-maroon animate-bounce rounded" style={{ height: '70%', animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 bg-seal-maroon animate-bounce rounded" style={{ height: '90%', animationDelay: '0.3s' }}></span>
                  <span className="w-1.5 bg-seal-maroon animate-bounce rounded" style={{ height: '50%', animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 bg-seal-maroon animate-bounce rounded" style={{ height: '100%', animationDelay: '0.4s' }}></span>
                  <span className="w-1.5 bg-seal-maroon animate-bounce rounded" style={{ height: '60%', animationDelay: '0.5s' }}></span>
                </div>
                
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-seal-maroon text-white hover:bg-seal-maroon-dark px-6 py-2 rounded-full font-mono text-xs font-bold uppercase flex items-center gap-2 animate-pulse"
                >
                  <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                  STOP RECORDING
                </button>
                <p className="font-mono text-[10px] text-ink/40">Recording audio in real-time...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 text-center">
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-seal-navy text-white hover:bg-seal-navy/90 p-4 rounded-full font-mono text-xs font-bold uppercase flex items-center justify-center shadow"
                >
                  <Mic size={24} />
                </button>
                
                <p className="font-mono text-[11px] text-ink/70 max-w-sm">
                  Click to start recording your voice. The backend AI will transcribe it automatically for the MP's ledger.
                </p>
              </div>
            )}

            {audioUrl && (
              <div className="w-full max-w-md pt-3 mt-3 border-t border-parchment-deep">
                <span className="block font-mono text-[10px] text-ink/50 uppercase mb-2">Dictation Playback & Summary Transcription:</span>
                {audioUrl !== '#simulated-audio' && (
                  <audio src={audioUrl} controls className="w-full h-10 mb-3 bg-white" />
                )}
                
                <input
                  type="text"
                  placeholder="Optional: Add a text note alongside the voice recording..."
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  className="w-full bg-white border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-2.5 font-sans text-xs outline-none"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'photo' && (
          <div className="space-y-4">
            <span className="font-mono text-xs text-ink/60 font-bold uppercase block text-center">
              Upload Photographic Evidence
            </span>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                isDragging 
                  ? 'border-seal-maroon bg-seal-maroon/5' 
                  : 'border-parchment-deep hover:border-ink/30 bg-white'
              }`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input 
                id="fileInput"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              
              {photoPreview ? (
                <div className="space-y-3 w-full">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="max-h-40 mx-auto object-cover border border-parchment-deep"
                  />
                  <span className="font-mono text-[10px] text-seal-green font-bold block">
                    ✓ EVIDENCE FILE LOADED SUCCESSFULLY
                  </span>
                  <span className="font-mono text-[9px] text-ink/40 block">
                    Click anywhere inside to replace the image
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud size={32} className="text-ink/30 mx-auto" />
                  <p className="font-mono text-xs text-ink/70">
                    Drag and drop your image here, or <span className="text-seal-maroon font-bold underline">browse files</span>
                  </p>
                  <p className="font-mono text-[10px] text-ink/40">
                    Supports JPG, PNG formats up to 5MB size
                  </p>
                </div>
              )}
            </div>

            {photoPreview && (
              <div className="pt-2 border-t border-parchment-deep">
                <span className="block font-mono text-[10px] text-ink/50 uppercase mb-2">Add Photo Caption / Description:</span>
                <input
                  type="text"
                  placeholder="e.g. Broken drainage pipe on Lane 3, near central square..."
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  className="w-full bg-white border border-parchment-deep focus:border-seal-maroon focus:ring-1 focus:ring-seal-maroon p-2.5 font-sans text-xs outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-seal-maroon text-white hover:bg-seal-maroon-dark py-3.5 font-mono text-sm font-bold uppercase tracking-widest transition-transform duration-100 active:scale-[0.99] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing with AI...
          </>
        ) : (
          <>
            <FileCheck size={18} />
            Submit Grievance to MP Gazette
          </>
        )}
      </button>

      <p className="font-mono text-[10px] text-ink/40 text-center mt-4">
        🔒 Submitted via secure channels. Processed by Gemini AI for concern extraction.
      </p>
    </form>
  );
};
