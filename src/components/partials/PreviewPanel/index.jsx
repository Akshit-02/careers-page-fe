import { useState } from "react";
import ImageBannerPreview from "../ImageBannerPreview";
import ImageTextPreview from "../ImageTextPreview";
import JobListPreview from "../JobListPreview";

const PreviewPanel = ({
  sections,
  theme,
  jobs,
  onSelectSection,
  isCareersPage = false,
}) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    employmentType: "",
    experienceLevel: "",
    workPolicy: "",
  });

  const renderSectionPreview = (section) => {
    if (!!section.isArchived) return null;

    const props = {
      section,
      theme,
      onSelectSection,
      isCareersPage,
    };

    switch (section.type) {
      case "IMAGE_BANNER":
        return <ImageBannerPreview {...props} />;
      case "IMAGE_TEXT":
        return <ImageTextPreview {...props} />;
      case "JOB_LIST":
        return (
          <JobListPreview
            {...props}
            jobs={jobs}
            search={search}
            filters={filters}
            onSearchChange={setSearch}
            onFilterChange={setFilters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`mx-auto shadow-xl ${isCareersPage ? "" : "max-w-5xl"}`}
      style={{ backgroundColor: theme.backgroundColor || "#ffffff" }}
    >
      {sections.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{ color: theme.secondaryColor || "#6b7280" }}
        >
          <p className="text-lg mb-4">No sections yet</p>
          <p className="text-sm">
            Click the + button in the sidebar to add your first section
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.id}>{renderSectionPreview(section)}</div>
        ))
      )}
    </div>
  );
};

export default PreviewPanel;
