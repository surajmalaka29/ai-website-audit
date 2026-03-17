import React, { useState } from 'react';
import axios from 'axios';
import { 
  Zap, 
  FileText, 
  Heading, 
  MousePointer2, 
  Link2, 
  Image as ImageIcon, 
  Sparkles,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function AuditDashboard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [error, setError] = useState('');

  const handleRunAudit = async () => {
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/audit', { url });
      setAuditData(response.data);
    } catch (err) {
      setError('Failed to fetch audit data. Please ensure your backend server is running on port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto rounded-3xl border-4 border-indigo-100/50 bg-white shadow-xl overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            AuditAI
          </div>
          
          <div className="flex-1 w-full max-w-2xl px-4">
            <div className="relative">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button 
            onClick={handleRunAudit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors whitespace-nowrap w-full md:w-auto justify-center"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
            ) : (
              <>Run Audit <ChevronRight size={18} /></>
            )}
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Main Content Area */}
        {!auditData && !loading && !error ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center min-h-[500px]">
            <Sparkles size={48} className="mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">Ready to analyze</h2>
            <p className="max-w-md mx-auto">Enter a URL above and click "Run Audit" to extract factual metrics and generate AI-driven insights.</p>
          </div>
        ) : loading ? (
           <div className="p-12 text-center text-blue-500 flex flex-col items-center justify-center min-h-[500px]">
            <Loader2 size={48} className="mb-4 animate-spin text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Analyzing Website...</h2>
            <p className="text-gray-500 max-w-md mx-auto">Extracting DOM elements and running semantic AI analysis. This might take a few seconds.</p>
          </div>
        ) : auditData ? (
          <main className="p-6 md:p-8 bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Snapshot & Scores */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Page Snapshot Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-6">Page Snapshot</h2>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FileText size={18} className="text-gray-400" /> Total Word Count
                    </div>
                    <span className="font-bold text-gray-900">{auditData.metrics?.wordCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Heading size={18} className="text-gray-400" /> Headings (H1-H3)
                    </div>
                    <span className="font-bold text-gray-900">
                      {(auditData.metrics?.headings?.h1 || 0) + (auditData.metrics?.headings?.h2 || 0) + (auditData.metrics?.headings?.h3 || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MousePointer2 size={18} className="text-gray-400" /> CTA Buttons
                    </div>
                    <span className="font-bold text-gray-900">{auditData.metrics?.ctaCount || 0}</span>
                  </div>

                  {/* FIXED: Re-added Internal/External Links Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Link2 size={18} className="text-gray-400" /> Internal / External
                    </div>
                    <span className="font-bold text-gray-900">
                      {auditData.metrics?.links?.internal || 0} / {auditData.metrics?.links?.external || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-50">
                    <div className="flex items-center gap-3 text-gray-600">
                      <ImageIcon size={18} className="text-gray-400" /> Total Images
                    </div>
                    <span className="font-bold text-gray-900">{auditData.metrics?.images?.total || 0}</span>
                  </div>

                  {/* Missing Alt Text Alert */}
                  {(auditData.metrics?.images?.missingAltPercentage > 0) && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 pl-8">Missing Alt Text</span>
                      <span className="bg-red-50 text-red-500 font-bold px-2 py-1 rounded-md text-[10px] tracking-wide">
                        {auditData.metrics.images.missingAltPercentage}% MISSING
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta Info */}
                <div className="mt-8 space-y-4">
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Meta Title</h3>
                    <p className="text-sm text-gray-800 font-medium leading-snug">
                      {auditData.metrics?.title || "No title tag found"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Meta Description</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {auditData.metrics?.description || "No meta description found"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Insights & Recommendations */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* AI Insights Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Sparkles size={20} className="text-blue-500" />
                    AI Semantic Insights
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    AI Analysis Live
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* FIXED: Handling multiple potential JSON keys from Gemini */}
                  {auditData.ai?.insights?.map((insight, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-gray-900">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-orange-400' : index === 1 ? 'bg-emerald-500' : 'bg-blue-600'}`}></div> 
                        {insight.category || insight.title || 'Insight'}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {insight.text || insight.detail || insight.description || (typeof insight === 'string' ? insight : 'Error formatting insight text.')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-bold text-gray-900">Prioritized Recommendations</h2>
                </div>

                <div className="space-y-8">
                  {/* FIXED: Bulletproof mapping for Recommendations */}
                  {auditData.ai?.recommendations?.map((rec, index) => (
                    <React.Fragment key={index}>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm">
                              {rec.title || rec.heading || rec.name || `Recommendation ${index + 1}`}
                            </h3>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                              {rec.impact || rec.priority || 'RECOMMENDATION'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {rec.description || rec.detail || rec.text || (typeof rec === 'string' ? rec : 'No description provided.')}
                          </p>
                        </div>
                      </div>
                      {index !== (auditData.ai?.recommendations?.length - 1) && <hr className="border-gray-50" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </main>
        ) : null}

      </div>
    </div>
  );
}