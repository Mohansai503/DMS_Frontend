import { useState, useEffect } from "react";
//import "../animista.css";
import { useNavigate } from "react-router-dom";


// *** CHANGED: Updated URL to fetch ALL documents from database instead of just user ID 4 ***
const HomeUrl = "http://localhost:8080/api/documents/list/4";

interface Document {
  id: number;
  name: string;
  type?: string;
  size?: string;
  uploadDate?: string;
  [key: string]: any; 
}



const Home = () => {
  const [active, setActive] = useState("home");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Attempting to fetch from:", HomeUrl);
        
        const response = await fetch(HomeUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "home"   
  })
});


        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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
        console.error("Detailed error:", error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setError("Cannot connect to server. Please check if the backend is running on http://localhost:8080");
        } else {
          setError(error instanceof Error ? error.message : "Failed to fetch documents");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      
      const clickedElement = event.target as Element;
      const isInsideDropdown = clickedElement.closest('.dropdown-container');
      
      if (!isInsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (docId: number) => {
    setOpenDropdown(openDropdown === docId ? null : docId);
  };

  const handleMenuAction = (action: string, doc: Document) => {
    console.log(`${action} action for document:`, doc);
    setOpenDropdown(null);
    
    switch (action) {
      case 'download':
       
        break;
      case 'view':
        
        break;
      case 'restore':
        
        break;
      case 'share':
        
        break;
    }
  };

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#e0e7ff'}}>
      {/* Sidebar */}
      <div className="w-20 bg-white border-r px-4 py-6" style={{width: '200px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '24px 16px'}}>
        <h1 className="text-3xl font-extrabold mb-6" style={{fontSize: '30px', fontWeight: '800', marginBottom: '24px'}}>DMS</h1>

        <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {["home", "recent", "trash","➕ New"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                if (item === "recent") {
                  navigate("/recentpage");
                }
              }}
              className={`w-full flex items-center gap-3 rounded-full px-4 py-2 capitalize ${
                active === item
                  ? "bg-yellow-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
              style={{
                width: '70%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '9999px',
                padding: '4px 8px',
                textTransform: 'capitalize',
                backgroundColor: active === item ? '#fef3c7' : 'transparent',
                fontWeight: active === item ? '500' : 'normal',
                fontSize: '14px'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6" style={{flex: '1', padding: '24px 32px'}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
          <div className="w-2/3 relative" style={{width: '66.666667%', position: 'relative'}}>
            <input
              type="text"
              placeholder="Search Document..."
              className="w-full rounded-full bg-gray-200 px-10 py-3 text-sm focus:outline-none"
              style={{
                width: '100%',
                borderRadius: '9999px',
                backgroundColor: '#e5e7eb',
                padding: '12px 40px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <span className="absolute left-4 top-3 text-gray-500" style={{position: 'absolute', left: '16px', top: '12px', color: '#6b7280'}}>🔍</span>
          </div>

          <button className="rounded-xl border bg-sky-50 px-5 py-2 text-sm font-medium hover:bg-yellow-100" style={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f0f9ff',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            LogOut
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-6" style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px'}}>Welcome to DMS</h2>

        
        <div className="bg-gray-200 rounded-lg shadow-sm p-6" style={{backgroundColor: '#e5e7eb', borderRadius: '8px', padding: '24px'}}>
          <h3 className="text-lg font-medium mb-4" style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>All Documents</h3>
          
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
              <div className="mt-2 space-x-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Documents List */}
          {!loading && !error && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
               
                  <p>No documents found in database</p>
                </div>
              ) : (
                documents.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 bg-white"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {doc.name || doc.title || `Document ${doc.id}`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {doc.type || 'Unknown type'} • {doc.size || 'Unknown size'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right relative dropdown-container">
                      <p className="text-sm text-gray-500 mb-1">
                        {doc.uploadDate || doc.createdAt || 'Unknown date'}
                      </p>
                      {/* Three Dots Button - Google Style */}
                      <button 
                        onClick={() => toggleDropdown(doc.id || index)}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="More options"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === (doc.id || index) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20 animate-in fade-in duration-200">
                          <div className="py-1">
                            <button
                              onClick={() => handleMenuAction('view', doc)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleMenuAction('restore', doc)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore
                            </button>
                            <button
                              onClick={() => handleMenuAction('download', doc)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download
                            </button>
                            <button
                              onClick={() => handleMenuAction('share', doc)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Share
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;