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
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              预览、导出、管理你的 SVG 文件
            </p>
            <a 
              href="https://github.com/liujuntao123/new-svg-viewer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              title="查看 GitHub 源码"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
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
