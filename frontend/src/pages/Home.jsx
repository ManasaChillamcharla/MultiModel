import { Link } from 'react-router-dom';
import { FileText, Search, Zap, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Understand your documents with <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Upload PDFs, DOCX, CSVs, and Images. Our multimodal AI instantly extracts text, generates insights, and enables powerful semantic search.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Get Started
          </Link>
          <Link to="/search" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Try Search
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
        <FeatureCard icon={<FileText size={32} className="text-indigo-400" />} title="Multimodal Support" desc="Upload text, PDFs, spreadsheets, and images for unified analysis." />
        <FeatureCard icon={<Zap size={32} className="text-purple-400" />} title="Instant Insights" desc="Automatic summaries, keywords, and AI-driven categorization." />
        <FeatureCard icon={<Search size={32} className="text-blue-400" />} title="Semantic Search" desc="Find exactly what you need using context, not just keywords." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 backdrop-blur-sm text-left">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </motion.div>
  );
}
