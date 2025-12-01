import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const pathname = usePathname();
  const { company } = useSelector((state) => state.company);

  const navItems = [
    { name: "Dashboard", href: `/${company?.slug || "dashboard"}`, icon: "📊" },
    {
      name: "Theme Editor",
      href: `/${company?.slug}/edit`,
      icon: "🎨",
    },
    {
      name: "Jobs",
      href: `/${company?.slug}/jobs`,
      icon: "💼",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 ">
      <div className="border-b border-gray-200 h-16">
        <img
          src="/png/whitecarrotLogo.png"
          alt="Logo"
          className="w-32 h-full mx-auto object-contain"
        />
      </div>
      <div className="px-4 py-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-[#5138ee]/10 text-[#5138ee]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
