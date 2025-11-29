"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [resume, setResume] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // --- CONFIG TO BYPASS NGROK WARNING PAGE ---
  const axiosConfig = {
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json"
    }
  };

  // 1. Parse resume using backend
  const extractData = async () => {
    if (!resume) {
      alert("Please enter or generate a resume first!");
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      // Pass config as 3rd argument for POST requests
      const res = await axios.post(
        `${API}/extract`,
        { text: resume },
        axiosConfig
      );
      setOutput(res.data);
    } catch (err) {
      console.error(err);
      setOutput({ error: "Request failed", details: err.message });
    }
    setLoading(false);
  };

  // 2. Generate fake resume
  const generateFakeResume = async () => {
    setLoading(true);
    setOutput(null);

    try {
      // Pass config as 2nd argument for GET requests
      const res = await axios.get(`${API}/generate`, axiosConfig);
      
      console.log("Received Fake Resume:", res.data);
      
      // Update state with the clean string from backend
      setResume(res.data.resume_text);
      
    } catch (err) {
      console.error("Error:", err);
      setOutput({ error: "Error generating resume", details: err.message });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      
      <h1 className="text-4xl font-bold mb-6 text-center">
        Resume Parser <span className="text-blue-400">Demo</span>
      </h1>

      {/* Input Card */}
      <div className="bg-gray-800/60 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-700">

        <label className="block text-lg font-semibold mb-2 text-gray-300">
          Resume Text
        </label>

        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste resume text here or click 'Generate'..."
          className="w-full h-64 p-4 bg-gray-950 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-mono resize-none text-gray-200"
        />

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          
          <button
            onClick={extractData}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 transition px-4 py-3 rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Parsing..." : "Parse Resume"}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Output JSON Card */}
      {output && (
        <div className="mt-8 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-black p-6 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-800 pb-2">
              Parsed Output
            </h2>
            <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <pre className="text-emerald-400 text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}