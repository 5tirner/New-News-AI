
import { useState } from "react";

function NewsFieldsPage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isField, setField] = useState([]);
  
  // const [isFirstVisible, setIsFirstVisible] = useState(true);


  const handleFieldSelection = (field) => {
    if (!isField.includes(field)) {
      setField([...isField, field]);
    }
    
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-[#F5E6CF] transition-all duration-300 p-4 flex flex-col`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className=" text-white p-2 rounded text-right"
        >
          {isSidebarOpen ? "⬅" : "➡"}
        </button>

        {isSidebarOpen && (
          <>
            <h2 className="font-bold mt-4">Fields</h2>
            <ul>
            {isField.map((field, index) => (
              <li key={index} className="mt-2">⚫ {field}</li>
            ))}
            </ul>
            <h2 className="font-bold mt-4">History</h2>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
            <div className="mt-2 bg-gray-400 h-8 w-full rounded"></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-light p-10 flex flex-col items-center">
        <h1 className="text-xl font-bold">Choose Your News Fields</h1>
        <div className="flex flex-wrap gap-4 mt-4">
        <button onClick={() => handleFieldSelection("Football")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
            Football
          </button>
          <button onClick={() => handleFieldSelection("Web Dev")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
            Web Dev
          </button>
          <button onClick={() => handleFieldSelection("Technology")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
            Technology
          </button>
          <button onClick={() => handleFieldSelection("Business")} className="border-black border-2 px-4 py-2 rounded-full bg-white">
            Business
          </button>
        </div>
      </div>
    </div>
  );
}


const Home = () => {
    return (
      // <div className="p-6 flex justify-center items-center">
          <NewsFieldsPage/>
      // </div>
    );
  };
  
  export default Home;
  