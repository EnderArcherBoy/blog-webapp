"use client";

import React from 'react';
import Link from "next/link";

export default function FooterBlog() {
  const scrollToArticles = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('articles');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">Novatus Global</div>
            <p className="text-gray-400 text-sm">
              Your trusted source for insightful articles and engaging content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
                Home
              </Link>
              <Link href="#articles" className="text-gray-400 hover:text-white transition text-sm" onClick={scrollToArticles}>
                Articles
              </Link>
              <Link href="/about-page" className="text-gray-400 hover:text-white transition text-sm">
                About Us
              </Link>
              <Link href="/team-page" className="text-gray-400 hover:text-white transition text-sm">
                Our Team
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <nav className="flex flex-col space-y-2">
              <a href="mailto:info@novatusglobal.com" className="text-gray-400 hover:text-white transition text-sm">
                info@novatusglobal.com
              </a>
              <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition text-sm">
                +123 456 7890
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          {new Date().getFullYear()} Novatus Global. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
