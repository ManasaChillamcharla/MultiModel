import { useState } from 'react';
import { Search as SearchIcon, Loader2, FileText } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.post('/search/semantic', { query });
      setResults(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Semantic Search</h1>
        <p className="text-gray-400">Search through your documents using natural language and context.</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'financial reports from last quarter'"
          className="w-full bg-gray-800/80 border border-gray-700 rounded-full py-4 pl-6 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-xl"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-full p-3 transition-colors flex items-center justify-center"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <SearchIcon size={20} />}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <div className="text-center text-gray-400 py-10">No matching documents found.</div>
      )}

      <div className="space-y-6">
        {results.map((result, idx) => (
          <div key={result._id || idx} className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-400" />
                <h3 className="text-lg font-semibold">{result.filename}</h3>
              </div>
              <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                Score: {(result.similarityScore * 100).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">{result.summary}</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords?.map(kw => (
                <span key={kw} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
