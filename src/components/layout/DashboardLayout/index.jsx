"use client";

import Sidebar from "../Sidebar";
import TopNav from "../TopNav";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopNav />
      <main className="pt-16 pl-64 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
