declare module 'react';
declare module 'react-dom';
declare module 'file-saver';
declare module 'html-to-image';
declare module 'react-syntax-highlighter';
declare module 'react-syntax-highlighter/dist/cjs/styles/hljs';
declare module 'react-toastify';
declare module 'next/dynamic';

interface Window {
  FileReader: new () => FileReader;
  File: any;
  Blob: any;
  URL: {
    createObjectURL(blob: Blob): string;
    revokeObjectURL(url: string): void;
  };
}

interface FileReader {
  readAsText(file: Blob): void;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null;
  result: string | ArrayBuffer | null;
}

interface Navigator {
  clipboard: {
    writeText(text: string): Promise<void>;
  };
} 