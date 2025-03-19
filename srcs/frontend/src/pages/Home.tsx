
import { useState , useEffect} from "react";
// import FieldSection from "./FieldPage";
import NewsPage from "./newsPage";
import ChatSection from "./ChatSection";
import { TbLayoutNavbarCollapseFilled } from "react-icons/tb";
import { TbLayoutNavbarExpandFilled } from "react-icons/tb";






function NewsFieldsPage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isField, setField] = useState([]);

  const [isFirstVisible, setIsFirstVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("fields"); // Replace with your API URL
        const data = await response.json();
        setField(data.fields); // Assuming data has a 'fields' array
        console.log("this is list of field" + data.fields)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once
  return (
    <div className="flex h-screen bg-[#fdfbee]">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64 bg-[#F5E6CF]" : "w-1 bg-[#fdfbee]"
          }  transition-all duration-300 p-4 flex flex-col`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className=" text-white p-2 rounded text-right"
        >
          {isSidebarOpen ? <TbLayoutNavbarCollapseFilled style = {{transform: 'rotate(-90deg)' }} size={30} color="gray" /> : <TbLayoutNavbarExpandFilled style = {{transform: 'rotate(-90deg)' }} size={30} color="gray" />}
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
        {isFirstVisible ? 
        (<NewsPage setIsFirstVisible={setIsFirstVisible} />) : 
        (<ChatSection setIsFirstVisible={setIsFirstVisible}  />)
        }
      </div >
    </div >
  );
}


const Home = () => {
  return (
    // <div className="p-6 flex justify-center items-center">
    <NewsFieldsPage />
    // </div>
  );
};

export default Home;
