
import NewsPage from "./newsPage";
import Layout from "../components/Layout"


const Home = () => {
  return (
    <div className="flex h-screen bg-[#fdfbee]">
      {/*  SideBar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 bg-light bg-gray-200 lm:p-10 md:4 flex flex-col items-center">
      <Layout>
      <NewsPage  /> 
      </Layout>
      </div >
    </div >
  );
};

export default Home;

