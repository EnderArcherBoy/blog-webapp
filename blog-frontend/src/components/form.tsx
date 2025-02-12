"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateArticle() {
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg sm:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-xl p-6">
        
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Create Article</CardTitle>
          <CardDescription className="text-gray-600">Write your article in one-click.</CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form className="space-y-4">
            
            {/* Title Input */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
              <Input id="title" placeholder="Your Article Title" className="w-full p-2 border rounded-md" />
            </div>

            {/* Content Input */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="content" className="text-gray-700 font-medium">Article Content</Label>
              <Textarea id="content" placeholder="Write your content here..." className="w-full p-2 border rounded-md h-40" />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700 font-medium">Upload Image</Label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-md" />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <img src={image} alt="Uploaded Preview" className="mt-1 w-full rounded-md" />
                </div>
              )}
            </div>
          </form>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-200">Cancel</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
