
import NewsPage from "./newsPage";
import Sidebar from "../components/Sidebar";


const Home = () => {
  return (
    <div className="flex h-screen bg-[#fdfbee]">
      {/*  SideBar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-light lm:p-10 md:4 flex flex-col items-center">
      <NewsPage  /> 
      </div >
    </div >
  );
};

export default Home;
