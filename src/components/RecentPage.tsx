import { useEffect, useState } from "react";
import "./animations.css";
import "../index.css";

const BackendUrl = "http://localhost:8080/api/documents/1";

interface Document {
  id: number;
  name: string;
  type?: string;
  size?: string;
  uploadDate?: string;
  [key: string]: any; 
}

const RecentPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(BackendUrl);
        const data = await response.json();

        //to get information in console

        console.log("API Response:", data); 

        // Handle different response formats
        if (Array.isArray(data)) {
          setDocuments(data);
        } else if (data.documents && Array.isArray(data.documents)) {
          setDocuments(data.documents);
        } else if (data.data && Array.isArray(data.data)) {
          setDocuments(data.data);
        } else {
          // If it's a single document
          setDocuments([data]);
        }
      
        
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="flex min-h-screen bg-indigo-100">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r px-4 py-6">
        <h1 className="text-3xl font-extrabold mb-6 focus-in-contract-bck">
          DMS
        </h1>

         <button className="w-full mb-6 flex items-center gap-2 rounded-xl border bg-white px-4 py-2 shadow hover:bg-gray-50 bounce-in-top">
          Recent
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-2/3 relative">
            <input
              type="text"
              placeholder="Search Document..."
              className="w-full rounded-full bg-gray-200 px-10 py-3 text-sm focus:outline-none"
            />
            <span className="absolute left-4 top-3 text-gray-500">🔍</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6 focus-in-expand-fwd">
          Recently uploaded files ({documents.length})
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading documents...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Documents List */}
        {!loading && !error && (
          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No documents found</p>
              </div>
            ) : (
              documents.map((doc, index) => (
                <div
                  key={doc.id || index}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {doc.name || doc.title || `Document ${doc.id}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doc.type || 'Unknown type'} • {doc.size || 'Unknown size'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {doc.uploadDate || doc.createdAt || 'Unknown date'}
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecentPage;
