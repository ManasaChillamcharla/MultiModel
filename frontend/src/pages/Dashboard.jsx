import { useEffect, useState } from 'react';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(docs => docs.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {documents.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/20 rounded-2xl border border-gray-800">
          <FileText size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">No documents found. Upload one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc._id} className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 relative group">
              <button 
                onClick={() => deleteDocument(doc._id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-indigo-400" />
                <h3 className="font-semibold truncate pr-8" title={doc.filename}>{doc.filename}</h3>
              </div>
              <div className="mb-4">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{doc.fileType.split('/')[1] || doc.fileType}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">{doc.summary}</p>
              <div className="text-xs text-gray-500">
                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
