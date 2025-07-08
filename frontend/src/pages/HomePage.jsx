import React, { useEffect } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-100 via-white to-emerald-200 text-gray-800 pt-20">
        {/* Hero Section */}
        <section className="text-center py-24 px-4" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-emerald-700 mb-4">
            Welcome to{" "}
            <span className="text-gray-900">My Budgetary Project</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-700">
            Simplify your financial life with smart tracking, powerful
            analytics, and automated budget planning.
          </p>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Expense Tracking",
                desc: "Automatically categorize your expenses and visualize your spending patterns.",
                icon: "💼",
              },
              {
                title: "Advanced Analytics",
                desc: "Understand your financial health with powerful graphs and summaries.",
                icon: "📊",
              },
              {
                title: "Recurring Reminders",
                desc: "Never miss a bill — set recurring expenses and get notified.",
                icon: "⏰",
              },
              {
                title: "Budget Goals",
                desc: "Set personalized monthly or yearly budgeting goals and stay on track.",
                icon: "🎯",
              },
              {
                title: "Secure & Private",
                desc: "All your data is encrypted and stored securely.",
                icon: "🔒",
              },
              {
                title: "Mobile Responsive",
                desc: "Access your dashboard on any device, anytime, anywhere.",
                icon: "📱",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-emerald-700">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="text-center py-20 px-4 bg-gradient-to-br from-emerald-200 via-emerald-100 to-white"
          data-aos="fade-up"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
            Get started now and make smarter decisions with every rupee.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/dash"
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition"
            >
              Go to Dashboard
            </a>
            <a
              href="/report"
              className="bg-white border border-emerald-500 text-emerald-700 px-6 py-3 rounded-md hover:bg-emerald-100 transition"
            >
              View Reports
            </a>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
