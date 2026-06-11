"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [text, setText] = useState("");

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
                  disabled={!image} // Зураг байхгүй бол товчлуур дарагдахгүй
                  className={`${
                    image ? "bg-black hover:bg-black" : "bg-gray-400"
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all cursor-pointer`}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight ">
                  Here is the summary
                </h3>
              </div>
              <p className="text-gray-500 text-[14px]">
                First, enter your image to recognize an ingredients.
              </p>
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-[124px] border-2 border-gray-100 rounded-lg px-4 py-4 text-sm bg-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-300 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={text.trim().length === 0} // Текст хоосон бол товчлуурыг идэвхгүй болгоно
                  className={`${
                    text.trim().length > 0
                      ? "bg-black hover:bg-gray-800" // Текст бичсэн үед хар өнгөтэй болно
                      : "bg-gray-400 cursor-not-allowed" // Хоосон үед саарал байна
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all`}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* IDENTIFIED INGREDIENTS SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight ">
                  Identified Ingredients
                </h3>
              </div>
              <p className="text-gray-500 text-[14px]">
                First, enter your text to recognize an ingredient.
              </p>
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-[124px] border-2 border-gray-100 rounded-lg px-4 py-4 text-sm bg-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-300 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={text.trim().length === 0} // Текст хоосон бол товчлуурыг идэвхгүй болгоно
                  className={`${
                    text.trim().length > 0
                      ? "bg-black hover:bg-gray-800" // Текст бичсэн үед хар өнгөтэй болно
                      : "bg-gray-400 cursor-not-allowed" // Хоосон үед саарал байна
                  } text-white px-8 py-6 rounded-lg text-lg font-medium shadow-lg transition-all`}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* RESULT SECTION */}
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-6 h-6 text-black" />
                <h3 className="text-xl font-medium tracking-tight ">Result</h3>
              </div>
              <p className="text-gray-500 text-[14px]">
                First, enter your text to generate an image.
              </p>
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
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white p-3 rounded-lg text-sm w-fit max-w-[80%] text-center">
                How can I help you today?
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-gray-100 text-black p-3 rounded-lg text-sm w-fit max-w-[80%] text-center">
                Can you describe me detailed delicious pasta carbonara?
              </div>
            </div>
          </div>

          <div className="py-2 px-4 border-t flex gap-2">
            <textarea
              placeholder="Type your message..."
              rows={1}
              className=" flex-1 text-sm border rounded-lg px-4 py-2 placeholder:text-gray-400 focus-visible:ring-gray-300 transition-all resize-none"
            />
            <Button
              size="icon"
              className="bg-black rounded-full w-10 h-10 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
