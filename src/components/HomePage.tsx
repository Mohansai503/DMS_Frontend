import { useState, useEffect } from "react";
import "./animations.css";
//import "../animista.css";
import { useNavigate } from "react-router-dom";



const HomeUrl = "http://localhost:8080/api/documents/list/";

const LogOutUrl = "http://localhost:8080/api/documents/logout";

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
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocForShare, setSelectedDocForShare] = useState<Document | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  
  const navigate = useNavigate();

  const handlelogout = async() =>{
    try{
      /*await fetch(LogOutUrl,{
        method:"post",
        credentials:"include",
      })*/
       //localStorage.clear();
      sessionStorage.clear();
      navigate("/login")
    }catch(error){
      console.error("logoutfailed")
    }

  }
 
  useEffect(() => {
    console.log("use Effect started calling in home page:");
    if (!sessionStorage.getItem("token") || !sessionStorage.getItem("userId")) {
          navigate("/login");
        } 
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Attempting to fetch from:", HomeUrl);
 

          const response = await fetch(HomeUrl + sessionStorage.getItem("userId"), {
            method: "POST",
            headers: {
         "Content-Type": "application/json",
          "Authorization" : 'Bearer ' + sessionStorage.getItem("token"),
           },
            body: JSON.stringify({
             type: "home"   
  
            })
            
        })         
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
    }
    fetchDocuments();
},[active]);

    /*fetchDocuments();
  }, []);*/

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
        handleDownload(doc);
        break;
      case 'view':
        handleView(doc);
        break;
      case 'restore':
        handleRestore(doc);
        break;
      case 'share':
        handleShare(doc);
        break;
    }
  };

  const handleDownload = async (doc: Document) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/api/documents/view/${doc.docId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = doc.docName || "document";

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Download error:", error);
    alert("Download failed");
  }
};

  const handleView = (doc: Document) => {
    console.log("Viewing document:", doc.docName);
    // Navigate to document viewer and pass document data
    navigate(`/documents/view/${doc.docId}`, {
      state: {
        document: {
          docId: doc.docId,
          docName: doc.docName,
          documentType: doc.documentType || "Unknown",
          docSize: doc.docSize || "Unknown",
          docUploadDate: doc.docUploadDate || "Unknown date",
        }
      }
    });
  };

  const handleRestore = async (doc: Document) => {
    console.log("Restoring document:", doc.docName);
    try {
      const response = await fetch(`http://localhost:8080/api/documents/restore/${doc.docId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + sessionStorage.getItem("token"),
        }
      });
      if (response.ok) {
        alert(`${doc.docName} restored successfully!`);
        // Refresh the documents list
        window.location.reload();
      } else {
        alert("Failed to restore document");
      }
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Error restoring document");
    }
  };

  const handleShare = (doc: Document) => {
    console.log("Sharing document:", doc.docName);
    setSelectedDocForShare(doc);
    setShareModalOpen(true);
  };

  const submitShare = async () => {
    if (!shareEmail || !selectedDocForShare) return;
    
    try {
      const response = await fetch("http://localhost:8080/api/documents/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          docId: selectedDocForShare.docId,
          email: shareEmail
        })
      });
      
      if (response.ok) {
        alert(`Document shared with ${shareEmail} successfully!`);
        setShareModalOpen(false);
        setShareEmail("");
        setSelectedDocForShare(null);
      } else {
        alert("Failed to share document");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("Error sharing document");
    }
  };

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#e0e7ff'}}>
      {/* Sidebar */}
      <div className="w-20 bg-white border-r px-4 py-6" style={{width: '200px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '24px 16px'}}>
        <h1 className="text-3xl font-extrabold mb-6" style={{fontSize: '30px', fontWeight: '800', marginBottom: '24px'}}>DMS</h1>

        <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {["home", "recent", "trash","➕ New","last 30 days"].map((item) => (
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

          <button onClick={handlelogout} className="rounded-xl border bg-sky-50 px-5 py-2 text-sm font-medium hover:bg-yellow-100" style={{
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
                    key={doc.docId || index}
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
                          {doc.docName  || `Document ${doc.docId}`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {doc.documentType || 'Unknown type'} • {doc.docSize || 'Unknown size'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right relative dropdown-container">
                      <p className="text-sm text-gray-500 mb-1">
                        {doc.docUploadDate || doc.createdAt || 'Unknown date'}
                      </p>
                      
                     <div
                       onClick={() => toggleDropdown(doc.docId || index)}
                       className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer"
                     >
                     <svg 
                        className="w-3 h-3" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                  >
                     <circle cx="12" cy="6" r="0.8" />
                     <circle cx="12" cy="10" r="0.8" />
                     <circle cx="12" cy="14" r="0.8" />
                     </svg>
                     </div>
                      
                     
                      {openDropdown === (doc.docId || index) && (
  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">

    {/* View */}
    <button
      onClick={() => handleMenuAction("view", doc)}
      className="flex items-center gap-4 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 group"
    >
      <span className="text-xl">👁️</span>
      <span className="font-semibold group-hover:text-blue-600">View</span>
    </button>

    <div className="border-t border-gray-100"></div>

    {/* Download */}
    <button
      onClick={() => handleMenuAction("download", doc)}
      className="flex items-center gap-4 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-all duration-200 group"
    >
      <span className="text-xl">⬇</span>
      <span className="font-semibold group-hover:text-green-600">Download</span>
    </button>

    <div className="border-t border-gray-100"></div>

    {/* Restore */}
    <button
      onClick={() => handleMenuAction("restore", doc)}
      className="flex items-center gap-4 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-all duration-200 group"
    >
      <span className="text-xl">🔄</span>
      <span className="font-semibold group-hover:text-purple-600">Restore</span>
    </button>

    <div className="border-t border-gray-100"></div>

    {/* Share */}
    <button
      onClick={() => handleMenuAction("share", doc)}
      className="flex items-center gap-4 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-all duration-200 group"
    >
      <span className="text-xl">🔗</span>
      <span className="font-semibold group-hover:text-orange-600">Share</span>
    </button>

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

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Share Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share "{selectedDocForShare?.docName}" with other users
            </p>
            <input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShareModalOpen(false);
                  setShareEmail("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitShare}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;