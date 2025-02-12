import * as React from "react"
import ImageDesc from "@/components/about-page/image-desc"
import AboutDesc from "@/components/about-page/about-desc"

export default function Blog() {
  return (
    <>
    <div className="">
      <ImageDesc></ImageDesc>
    </div>
    <div className="my-32 ml-24 max-w-[110rem]">
        <AboutDesc></AboutDesc>
    </div>
    
    </>
   
  )
}
