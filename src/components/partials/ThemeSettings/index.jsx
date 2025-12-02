const ThemeSettings = ({ theme, onUpdateColor }) => {
  const colorInputs = [
    { key: "primaryColor", label: "Primary Color" },
    { key: "secondaryColor", label: "Secondary Color" },
    { key: "textColor", label: "Text Color" },
    { key: "backgroundColor", label: "Background Color" },
  ];

  return (
    <div className="px-6 py-4 border-b">
      <h3 className="font-semibold mb-4">Theme</h3>
      <div className="space-y-3">
        {colorInputs.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type="color"
              value={theme[key] || "#000000"}
              onChange={(e) => onUpdateColor(key, e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
