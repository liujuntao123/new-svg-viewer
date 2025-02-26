"use client";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with browser-specific APIs
const SVGViewer = dynamic(() => import('../components/SVGViewer'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastContainer 
        position="bottom-right" 
        theme="colored"
        aria-label="Notifications" 
      />
      
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className=" mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
              <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.735 15.126C7.14 15.568 6 15.272 6 14.5s1.14-1.068 1.735-.626c.544.44 1.476 1.195 2 1.626.73.522 1.35.962 2.265.962.915 0 1.394-.44 2.265-.962.524-.431 1.456-1.185 2-1.626.595-.442 1.735-.146 1.735.626s-1.14 1.068-1.735.626c-.544-.44-1.476-1.195-2-1.626-.871-.522-1.35-.962-2.265-.962-.915 0-1.535.44-2.265.962-.524.431-1.456 1.185-2 1.626z" fill="currentColor"/>
            </svg>
            SVG 预览
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center sm:text-right">
            预览、导出、管理你的 SVG 文件
          </p>
        </div>
      </header>

      <main className="h-[calc(100vh-120px)] py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg flex-1 p-6">
          <SVGViewer className="h-full" />
        </div>
      </main>

      <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} New SVG Viewer. Built with Next.js and TailwindCSS.</p>
      </footer>
    </div>
  );
}
