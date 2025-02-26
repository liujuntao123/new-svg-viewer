import { useState } from 'react';

interface SampleSVGsProps {
  onSelectSample: (svgCode: string) => void;
}

const samples = [
  { 
    name: 'Logo',
    path: '/samples/logo.svg'
  },
  { 
    name: 'Chart',
    path: '/samples/chart.svg'
  }
];

const SampleSVGs: React.FC<SampleSVGsProps> = ({ onSelectSample }) => {
  const [loading, setLoading] = useState({});

  const loadSampleSVG = async (path: string) => {
    setLoading((prev: Record<string, boolean>) => ({ ...prev, [path]: true }));
    
    try {
      const response = await fetch(path);
      const svgCode = await response.text();
      onSelectSample(svgCode);
    } catch (error) {
      console.error('Failed to load sample SVG:', error);
    } finally {
      setLoading((prev: Record<string, boolean>) => ({ ...prev, [path]: false }));
    }
  };

  return (
    <div className="flex items-center">
      <h3 className="text-sm font-medium mr-2">示例:</h3>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={sample.path}
            onClick={() => loadSampleSVG(sample.path)}
            disabled={loading[sample.path]}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
          >
            {loading[sample.path] ? 'Loading...' : sample.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleSVGs; 