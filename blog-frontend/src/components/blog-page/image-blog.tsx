import ButtonBlog from "./button-blog"



export default function BlogImage() {
    return (
        <div className="w-full -z-20">
          
            <img src="./assets/alam.jpg" className="w-full h-[700px] object-cover" alt="Banner" id=""/>

          
            <div className="absolute top-1/2 -translate-y-44 pl-56 left-0 flex flex-col justify-center items-start text-white space-y-2">
                
                <div className="text-8xl" id="">
                    Your Title here
                </div>
                <div className="pt-12 -translate-x-9">
                    <a href="#blog"><ButtonBlog></ButtonBlog></a>
                </div>

            </div>
        </div>
    );
}
