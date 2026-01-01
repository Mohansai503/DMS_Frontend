import { useState } from "react";
//import "../animista.css";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const [active, setActive] = useState("home","new folder");
  

  const navigate = useNavigate();





  return (
    <div className="flex min-h-screen bg-indigo-100">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r px-4 py-6">
        <h1 className="text-3xl font-extrabold mb-6">DMS</h1>

       
        <div className="space-y-2">
          {["home", "recent", "trash","➕ New"].map((item) => (
            <button
              key={item}
              onClick={() => {setActive(item);
                 if (item === "recent" ) {
                  navigate("/recentpage");
                  }
                  

              }}
              className={`w-full flex items-center gap-3 rounded-full px-4 py-2 capitalize ${
                active === item
                  ? "bg-yellow-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
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

          <button className="rounded-xl border bg-sky-50 px-5 py-2 text-sm font-medium hover:bg-yellow-100 ">
            LogOut
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-10">Welcome to DMS</h2>
      </main>
    </div>
  );
};

export default Home;
