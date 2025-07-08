const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-inner w-full">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center">
        <p className="text-emerald-700 font-medium text-sm text-center">
          © {new Date().getFullYear()} My Budgetary Project. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
