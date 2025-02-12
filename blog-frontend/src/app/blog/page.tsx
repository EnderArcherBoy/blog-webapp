import * as React from "react"
import BlogImage from "@/components/image-blog"
import Desc from "@/components/blog-desc"

export default function BlogPage() {
  return (
    <>
    <div className="">
      <BlogImage></BlogImage>
    </div>
    <div className="my-32 ml-24 max-w-[110rem]">
        <Desc></Desc>
    </div>
    
    </>
   
  )
}
