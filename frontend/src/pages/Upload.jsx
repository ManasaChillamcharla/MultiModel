import { useState } from 'react';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/upload', formData);
      setResult(res.data);
      toast.success('Document analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upload Document</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-10 text-center hover:bg-gray-800/50 transition-colors bg-gray-800/20 backdrop-blur-sm">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadIcon size={48} className="text-gray-400 mb-4" />
                <span className="text-lg text-gray-300 font-medium">{file ? file.name : 'Click to select file'}</span>
                <span className="text-sm text-gray-500 mt-2">Supports PDF, DOCX, TXT, CSV, JSON, XLSX, Images</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Document'}
            </button>
          </form>
        </div>

        <div>
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 h-full">
              <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-semibold uppercase">Summary</h3>
                  <p className="text-gray-200 mt-1">{result.summary}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 font-semibold uppercase">Keywords</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.keywords?.map(kw => <span key={kw} className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">{kw}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 font-semibold uppercase">Insights</h3>
                  <ul className="list-disc list-inside mt-2 text-gray-200 space-y-1">
                    {result.insights?.map((insight, i) => <li key={i}>{insight}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
