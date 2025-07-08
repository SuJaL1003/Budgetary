import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
const DashboardLayout = (props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Add top padding to prevent content from hiding under header */}
      <main className="flex-grow px-4 pt-24">
        <ToastContainer />
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
