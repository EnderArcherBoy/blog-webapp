"use client";

import ButtonPage from "./button";

export default function BlogPage() {
    const scrollToArticles = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('articles');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full -z-20">
            <img src="./assets/alam.jpg" className="w-full h-[700px] object-cover" alt="Banner" />
            
            <div className="absolute top-1/2 -translate-y-72 pl-60 left-0 flex flex-col justify-center items-start text-white space-y-2">
                <div className="text-8xl">
                    Insight
                </div>
                <div className="text-3xl pt-12">
                    Discover expert insights to fortify your organisation's <br />
                    resilience and drive success in a dynamic landscape.
                </div>
                <div className="pt-12 -translate-x-9">
                    <a href="#articles" onClick={scrollToArticles}>
                        <ButtonPage />
                    </a>
                </div>
            </div>
        </div>
    );
}
