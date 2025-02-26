import { useState, useRef, useEffect } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { Copy, Download, Image, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import SampleSVGs from './SampleSVGs';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { syntaxHighlighting ,defaultHighlightStyle} from '@codemirror/language';


interface SVGViewerProps {
  initialSvg?: string;
}

// 自定义高亮配置（可选）
const svgHighlight = syntaxHighlighting(defaultHighlightStyle, { fallback: true });

// CodeMirror 扩展
const extensions = [
  xml(),
  oneDark,
  EditorView.lineWrapping,
  svgHighlight,
  EditorView.theme({
    "&": {
      height: "100%", // 设置编辑器的高度为100%
    }
  })
];

const SVGViewer: React.FC<SVGViewerProps> = ({ initialSvg = '' }) => {
  const [svgCode, setSvgCode] = useState<string>(initialSvg);
  const [fileName, setFileName] = useState<string>('svg-preview');
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [previewSvgCode, setPreviewSvgCode] = useState<string>('');

  const handleSvgChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgCode(e.target.value);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update filename without extension
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgCode(content);
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const exportAsImage = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!previewRef.current) return;
    
    try {
      let dataUrl: string;
      
      switch (format) {
        case 'png':
          dataUrl = await toPng(previewRef.current, { backgroundColor: 'white' });
          saveAs(dataUrl, `${fileName}.png`);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(previewRef.current, { backgroundColor: 'white' });
          saveAs(dataUrl, `${fileName}.jpg`);
          break;
        case 'svg':
          dataUrl = await toSvg(previewRef.current, { backgroundColor: 'white' });
          saveAs(dataUrl, `${fileName}.svg`);
          break;
      }
      
      toast.success(`导出为 ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const downloadSvgCode = () => {
    if (!svgCode.trim()) {
      toast.error('没有 SVG 代码可下载');
      return;
    }
    
    const blob = new Blob([svgCode], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${fileName}.svg`);
    toast.success('SVG 代码已下载');
  };

  const copySvgCode = async () => {
    if (!svgCode.trim()) {
      toast.error('没有 SVG 代码可复制');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(svgCode);
      toast.success('SVG 代码已复制到剪贴板');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('复制到剪贴板失败');
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  // Reset position when scale changes
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Detect if SVG is valid
  const isValidSvg = (code: string): boolean => {
    return /<svg[^>]*>[\s\S]*<\/svg>/i.test(code);
  };

  const clearSvgCode = () => {
    setSvgCode('');
    toast.info('SVG 内容已清除');
  };

  const handleClear = () => {
    setSvgCode('');
    toast.info('SVG 内容已清除');
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded.svg';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG 已下载');
  };

  const updatePreview = () => {
    if (isValidSvg(svgCode)) {
      setPreviewSvgCode(svgCode);
    } else {
      toast.error('无效的 SVG 代码');
    }
  };

  useEffect(() => {
    const state = EditorState.create({
      doc: svgCode,
      extensions: [
        ...extensions,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setPreviewSvgCode(update.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current!,
    });

    // 只在 svgCode 变化时更新编辑器的文档
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: svgCode }
    });

    return () => view.destroy();
  }, [svgCode]); // 只在 svgCode 变化时更新

  return (
    <div className="w-[1280px] h-full  mx-auto flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* SVG Input Section */}
        <div className="flex flex-col p-2 h-full">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-semibold">SVG 代码</h2>
            <div className="flex gap-2">
              <SampleSVGs onSelectSample={setSvgCode} />
              <button 
                onClick={clearSvgCode}
                className="ml-4 flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                清除
              </button>
              <button 
                onClick={triggerFileInput}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                <Upload size={16} />
                上传
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".svg" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
          </div>
          <div ref={editorRef} className="w-full h-[calc(100vh-310px)] overflow-auto" />
          
        </div>

        {/* SVG Preview Section */}
        <div className="flex flex-col p-2 ">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-semibold">预览</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm font-mono">{scale.toFixed(1)}倍</span>
              <button
                onClick={zoomIn}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => {
                  handleScaleChange(e);
                  resetPosition();
                }}
                className="w-24"
              />
            </div>
          </div>
          <div 
            ref={previewRef}
            className="flex-1 p-4 border rounded-md bg-[url('/checkerboard.svg')] flex items-center justify-center overflow-hidden relative h-[400px] min-h-[400px] min-w-[300px]"
          >
            {previewSvgCode ? (
              <div 
                style={{ 
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`, 
                  transformOrigin: 'center',
                  willChange: 'transform',
                  transition: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: previewSvgCode }}
              />
            ) : (
              <div className="text-gray-400 text-center">
                "SVG 预览将在此处显示"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-between  p-2">
      <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label htmlFor="fileName" className="text-sm font-medium">文件名:</label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={handleFileNameChange}
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">

        <button
          onClick={() => exportAsImage('png')}
          disabled={!svgCode || !isValidSvg(svgCode)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image size={18} />
          导出为 PNG
        </button>
        <button
          onClick={() => exportAsImage('jpeg')}
          disabled={!svgCode || !isValidSvg(svgCode)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image size={18} />
          导出为 JPEG
        </button>
        <button
          onClick={downloadSvgCode}
          disabled={!svgCode}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          下载 SVG
        </button>
        <button
          onClick={copySvgCode}
          disabled={!svgCode}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy size={18} />
          复制 SVG 代码
        </button>
          </div>
      </div>

    </div>
  );
};

export default SVGViewer; 