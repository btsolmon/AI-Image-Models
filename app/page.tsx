/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  RotateCw,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  X,
  Send,
  Trash,
} from "lucide-react";

export default function FoodAIInterface() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [recognitionText, setRecognitionText] = useState(""); // 2-р таб
  const [creatorText, setCreatorText] = useState(""); // 3-р таб
  const [chatInput, setChatInput] = useState(""); // Chat-ын input
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [recognitionResult, setRecognitionResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([{ role: "ai", content: "How can I help you today?" }]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (
    type: "analysis" | "recognition" | "creator",
  ) => {
    setLoading(true);
    try {
      if (type === "analysis") {
        // Gemini 1.5 Flash integration via API
        const res = await fetch("/api/caption/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`,
          );
        }
        const data = await res.json();
        setAnalysisResult(data.result);
      } else if (type === "recognition") {
        // Gemini 1.5 Flash integration for text
        const res = await fetch("/api/extract/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: recognitionText }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`,
          );
        }
        const data = await res.json();
        setRecognitionResult(data.result);
      } else if (type === "creator") {
        // FLUX.1 integration for image generation
        const res = await fetch("/api/generate-image/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: creatorText }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`,
          );
        }
        const data = await res.json();
        setGeneratedImage(data.imageUrl);
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      alert(error.message || "Үйлдэл хийхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = chatInput;
    if (!input.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: input }];
    setChatMessages(newMessages);
    setChatInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (error: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `Уучлаарай, алдаа гарлаа: ${error.message}` },
      ]);
    }
  };

  return (
    <div className="relative">
      <h1 className=" px-12 py-4 font-semibold border-b border-gray-200">
        AI tools
      </h1>
      <div className="max-w-2xl mx-auto p-8 bg-white min-height-screen">
        {/* 3 ТАБТАЙ ХЭСЭГ */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="bg-gray-100/50 p-1 rounded-lg mb-6">
            <TabsTrigger
              value="analysis"
              className="rounded-lg px-3 py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
            >
              Image analysis
            </TabsTrigger>
            <TabsTrigger
              value="recognition"
              className="rounded-lg px-3 py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
            >
              Ingredient recognition
            </TabsTrigger>
            <TabsTrigger
              value="creator"
              className="rounded-lg px-3 py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
            >
              Image creator
            </TabsTrigger>
          </TabsList>

          {/* 1. IMAGE ANALYSIS CONTENT */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-black" />
                <h2 className="text-xl font-medium tracking-tight">
                  Image analysis
                </h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-[40px] w-[48px] px-4 py-2 border-gray-200 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <p className="text-gray-500 text-[14px] mb-2">
              Upload a food photo, and AI will detect the ingredients.
            </p>

            <div className="space-y-4">
              {!image ? (
                <div className="relative border-2 border-gray-100 rounded-lg p-1 bg-white">
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <label className=" text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                      />
                    </label>
                    <span className="text-gray-400 text-sm font-mono">
                      JPG , PNG
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-[200px] h-[133px] rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                  >
                    <Trash className="w-3 h-3 cursor-pointer" />
                  </button>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => handleGenerate("analysis")}
                  disabled={!image || loading}
                  className={`${
                    image ? "bg-black hover:bg-black" : "bg-gray-400"
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all cursor-pointer`}
                >
                  {loading ? <RotateCw className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight">
                  Here is the summary
                </h3>
              </div>
              {analysisResult ? (
                <div className="text-sm text-gray-700 bg-white border border-gray-300 p-4 rounded-lg prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      // Жагсаалтын зүйл бүрийн хооронд зай нэмэх
                      li: ({ node, ...props }) => (
                        <li className="mb-2" {...props} />
                      ),
                      // Жагсаалтын үндсэн хэсэгт зай нэмэх
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 mb-4" {...props} />
                      ),
                      // Гарчиг эсвэл bold текстүүдэд зай нэмэх
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-bold block mt-3 mb-1"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {analysisResult}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500 text-[14px]">
                  {loading
                    ? "Working..."
                    : "First, enter your image to recognize an ingredients."}
                </p>
              )}
            </div>
          </TabsContent>

          {/* 2. INGREDIENT RECOGNITION CONTENT */}
          <TabsContent value="recognition" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-black" />
                <h2 className="text-xl font-medium tracking-tight">
                  Ingredient recognition
                </h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-[40px] w-[48px] px-4 py-2 border-gray-200 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <p className="text-gray-500 text-[14px] mb-2">
              Describe the food, and AI will detect the ingredients.
            </p>

            <div className="space-y-4">
              <div className="relative mt-4">
                <textarea
                  placeholder="Орц тодорхойлох"
                  value={recognitionText} // Энд өөр state ашиглана
                  onChange={(e) => setRecognitionText(e.target.value)}
                  className="w-full h-[124px] border-2 border-gray-100 rounded-lg px-4 py-4 text-sm bg-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-300 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleGenerate("recognition")}
                  disabled={recognitionText.trim().length === 0 || loading}
                  className={`${
                    recognitionText.trim().length > 0
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all`}
                >
                  {loading ? <RotateCw className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            {/* IDENTIFIED INGREDIENTS SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight">
                  Identified Ingredients
                </h3>
              </div>
              {recognitionResult ? (
                <div className="text-sm text-gray-700 bg-white border border-gray-300 p-4 rounded-lg prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      // analysisResult-той ижилхэн зайны тохиргоо
                      li: ({ node, ...props }) => (
                        <li className="mt-2" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc pl-5 mb-4 font-bold"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-bold block mt-3 mb-1"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {recognitionResult}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500 text-[14px]">
                  {loading
                    ? "Working on your image just wait for moment"
                    : "First, enter your text to recognize an ingredient."}
                </p>
              )}
            </div>
          </TabsContent>

          {/* 3. IMAGE CREATOR CONTENT */}
          <TabsContent value="creator" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-black" />
                <h2 className="text-xl font-medium tracking-tight">
                  Food image creator
                </h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-[40px] w-[48px] px-4 py-2 border-gray-200 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <p className="text-gray-500 text-[14px] mb-2">
              What food image do you want? Describe it briefly.
            </p>

            <div className="space-y-4">
              <div className="relative mt-4">
                <textarea
                  placeholder="Хоолны тайлбар"
                  value={creatorText} // Энд бас тусдаа state
                  onChange={(e) => setCreatorText(e.target.value)}
                  className="w-full h-[124px] border-2 border-gray-100 rounded-lg px-4 py-4 text-sm bg-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-300 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleGenerate("creator")}
                  disabled={creatorText.trim().length === 0 || loading}
                  className={`${
                    creatorText.trim().length > 0
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all`}
                >
                  {loading ? <RotateCw className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            {/* RESULT SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight ">Result</h3>
              </div>
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Food"
                  className="w-full rounded-lg shadow-md border"
                />
              ) : (
                <p className="text-gray-500 text-[14px]">
                  First, enter your text to generate an image.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full w-14 h-14 shadow-xl bg-black hover:bg-gray-800 transition-all cursor-pointer"
        >
          {isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-95 h-[500px] bg-white border border-gray-200 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-2.5 border-b flex justify-between items-center">
            <h3 className="pl-1">Chat assistant</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    msg.role === "user"
                      ? "bg-gray-100 text-black"
                      : "bg-gray-800 text-white"
                  } p-3 rounded-lg text-sm w-fit max-w-[80%]`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="py-2 px-4 border-t flex gap-2"
          >
            <textarea
              placeholder="Type your message..."
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className=" flex-1 text-sm border rounded-lg px-4 py-2 placeholder:text-gray-400 focus-visible:ring-gray-300 transition-all resize-none"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-black rounded-full w-10 h-10 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
