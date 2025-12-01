"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { uploadData } from "aws-amplify/storage";
import Button from "../../../components/common/Button";
import {
  createCareerPageSectionAPI,
  createCareerPageSectionContentAPI,
  getCareerPageBySlugAPI,
  updateCareerPageSectionAPI,
  updateCareerPageSectionContentAPI,
  updateThemeSettingAPI,
} from "../../../services/handleApi";
import { getMediaUrl } from "../../../utils/helper";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "../../../utils/icons";
import {
  departmentOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  workPolicyOptions,
} from "../../../utils/common";
import Select from "../../../components/common/Select";
import Input from "../../../components/common/Input";

const CareersPageEditor = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { company } = useSelector((state) => state.company);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [theme, setTheme] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    employmentType: "",
    experienceLevel: "",
    workPolicy: "",
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      !filters.department || job.department === filters.department;
    const matchesEmploymentType =
      !filters.employmentType || job.employmentType === filters.employmentType;
    const matchesExperienceLevel =
      !filters.experienceLevel ||
      job.experienceLevel === filters.experienceLevel;
    const matchesWorkPolicy =
      !filters.workPolicy || job.workPolicy === filters.workPolicy;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesEmploymentType &&
      matchesExperienceLevel &&
      matchesWorkPolicy
    );
  });

  useEffect(() => {
    if (company?.id) {
      fetchCareerPageDesign();
    }
  }, [company?.id]);

  const fetchCareerPageDesign = async () => {
    setLoading(true);
    try {
      const response = await getCareerPageBySlugAPI(slug);
      setTheme(response.theme);
      setSections(response.sections || []);
      setJobs(response.jobs || []);
      console.log("Career page response:", response);
    } catch (error) {
      console.error("Error fetching career page design:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      const result = await uploadData({
        path: `public/company/${file.name}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      return result.path;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const uploadedPath = await handleImageUpload(file);
    if (uploadedPath && selectedSection) {
      updateSectionContent(selectedSection.id, {
        imageUrl: uploadedPath,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update theme settings
      await updateThemeSettingAPI(theme.id, {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        textColor: theme.textColor,
        backgroundColor: theme.backgroundColor,
      });

      // Update sections order and visibility
      await Promise.all(
        sections.map((section, index) =>
          updateCareerPageSectionAPI(section.id, {
            order: index,
            isArchived: !section.isVisible,
          })
        )
      );

      // Update section content
      await Promise.all(
        sections.map((section) =>
          updateCareerPageSectionContentAPI(section.content.id, section.content)
        )
      );

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return;

    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const updateSectionContent = (id, newData) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, ...newData } } : s
      )
    );
    setSelectedSection({
      ...selectedSection,
      content: { ...selectedSection.content, ...newData },
    });
    setHasUnsavedChanges(true);
  };

  const toggleSectionVisibility = (id) => {
    setSections(
      sections.map((s) =>
        s.id === id
          ? { ...s, isVisible: !s.isVisible, isArchived: s.isVisible }
          : s
      )
    );
    setHasUnsavedChanges(true);
  };

  const deleteSection = async (id) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
  };

  const addSection = async (type) => {
    try {
      // Create new section
      const newSection = await createCareerPageSectionAPI({
        companyId: company.id,
        type,
        order: sections.length,
        isArchived: false,
      });

      // Create default content based on type
      const contentData = getDefaultContentForType(type, newSection.id);
      const newContent = await createCareerPageSectionContentAPI(contentData);

      setSections([
        ...sections,
        {
          ...newSection,
          content: newContent,
          isVisible: true,
        },
      ]);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const getDefaultContentForType = (type, sectionId) => {
    const baseContent = {
      sectionId,
      title: null,
      description: null,
      text: null,
      buttonText: null,
      buttonLink: null,
      imageUrl: null,
    };

    switch (type) {
      case "IMAGE_BANNER":
        return {
          ...baseContent,
          title: "New Hero Section",
          description: "Add your tagline here",
          buttonText: "Get Started",
          imageUrl: "public/common/default-banner.jpg",
        };
      case "IMAGE_TEXT":
        return {
          ...baseContent,
          title: "New Content Section",
          description: "Add a brief description",
          text: "Add your detailed content here",
          imageUrl: "public/common/default-image.jpg",
        };
      case "JOB_LIST":
        return {
          ...baseContent,
          title: "Open Positions",
        };
      default:
        return baseContent;
    }
  };

  const updateThemeColor = (key, value) => {
    setTheme({ ...theme, [key]: value });
    setHasUnsavedChanges(true);
  };

  // Section Renderers
  const renderImageBannerPreview = (section) => {
    const { content } = section;
    return (
      <div
        className="relative h-96 bg-cover bg-center cursor-pointer hover:ring-4 hover:ring-[#5138ee] transition-all"
        style={{
          backgroundImage: content.imageUrl
            ? `url(${getMediaUrl(content.imageUrl)})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
        onClick={() => setSelectedSection(section)}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
          {content.title && (
            <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
          )}
          {content.description && (
            <p className="text-xl mb-8">{content.description}</p>
          )}
          {content.buttonText && (
            <button
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {content.buttonText}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderImageTextPreview = (section) => {
    const { content } = section;
    return (
      <div
        className="p-12 cursor-pointer hover:ring-4 hover:ring-[#5138ee] transition-all bg-white"
        onClick={() => setSelectedSection(section)}
      >
        {content.title && (
          <h2
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: theme.primaryColor }}
          >
            {content.title}
          </h2>
        )}
        {content.description && (
          <p className="text-gray-700 text-center text-lg mb-4">
            {content.description}
          </p>
        )}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {content.text && (
            <p className="text-gray-600 leading-relaxed">{content.text}</p>
          )}

          {content.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={getMediaUrl(content.imageUrl)}
                alt={content.title}
                className="w-full h-64 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderJobListPreview = (section) => {
    const { content } = section;
    return (
      <div
        className="p-12 cursor-pointer hover:ring-4 hover:ring-[#5138ee] transition-all bg-white"
        onClick={() => setSelectedSection(section)}
      >
        <h2
          className="text-3xl text-center font-bold mb-8"
          style={{ color: theme.primaryColor }}
        >
          {content.title || "Open Positions"}
        </h2>
        <div className="mb-4">
          <Input
            placeholder="Search jobs..."
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-4">
          <Select
            options={workPolicyOptions}
            placeholder="Filter by work policy"
            className="w-full"
            value={filters.workPolicy}
            onChange={(e) =>
              setFilters({ ...filters, workPolicy: e.target.value })
            }
          />
          <Select
            options={departmentOptions}
            placeholder="Filter by department"
            className="w-full"
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
          />
          <Select
            options={employmentTypeOptions}
            placeholder="Filter by employment type"
            className="w-full"
            value={filters.employmentType}
            onChange={(e) =>
              setFilters({ ...filters, employmentType: e.target.value })
            }
          />
          <Select
            options={experienceLevelOptions}
            placeholder="Filter by experience level"
            className="w-full"
            value={filters.experienceLevel}
            onChange={(e) =>
              setFilters({ ...filters, experienceLevel: e.target.value })
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <tbody>
              {filteredJobs?.map((job) => (
                <tr
                  key={job.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 flex flex-col">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}{" "}
                    </span>
                  </td>

                  <td className="p-4">
                    {workPolicyOptions.find(
                      (option) => option.value === job.workPolicy
                    )?.label || job.workPolicy}
                  </td>
                  <td className="p-4">{job.location}</td>
                  <td className="p-4">
                    {departmentOptions.find(
                      (option) => option.value === job.department
                    )?.label || job.department}
                  </td>
                  <td className="p-4">
                    {employmentTypeOptions.find(
                      (option) => option.value === job.employmentType
                    )?.label || job.employmentType}
                  </td>
                  <td className="p-4">
                    {experienceLevelOptions.find(
                      (option) => option.value === job.experienceLevel
                    )?.label || job.experienceLevel}
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No jobs match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSectionPreview = (section) => {
    if (section.isArchived || section.isVisible === false) return null;

    switch (section.type) {
      case "IMAGE_BANNER":
        return renderImageBannerPreview(section);
      case "IMAGE_TEXT":
        return renderImageTextPreview(section);
      case "JOB_LIST":
        return renderJobListPreview(section);
      default:
        return null;
    }
  };

  const renderSettingsPanel = () => {
    if (!selectedSection) {
      return (
        <div className="p-6 text-gray-500 text-center">
          <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Click on a section in the preview to edit it</p>
        </div>
      );
    }

    const { content, type } = selectedSection;

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">
            {type.replace(/_/g, " ")} Settings
          </h3>
          <button
            onClick={() => setSelectedSection(null)}
            className="text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) =>
              updateSectionContent(selectedSection.id, {
                title: e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {(type === "IMAGE_BANNER" || type === "IMAGE_TEXT") && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={content.description || ""}
                onChange={(e) =>
                  updateSectionContent(selectedSection.id, {
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="space-y-3">
                {content.imageUrl && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={getMediaUrl(content.imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    uploading
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:border-[#5138ee]"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5138ee]"></div>
                      <span className="text-sm text-gray-600">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        {content.imageUrl ? "Change Image" : "Upload Image"}
                      </span>
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </>
        )}

        {type === "IMAGE_TEXT" && (
          <div>
            <label className="block text-sm font-medium mb-2">Body Text</label>
            <textarea
              value={content.text || ""}
              onChange={(e) =>
                updateSectionContent(selectedSection.id, {
                  text: e.target.value,
                })
              }
              rows={6}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

        {type === "IMAGE_BANNER" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={content.buttonText || ""}
                onChange={(e) =>
                  updateSectionContent(selectedSection.id, {
                    buttonText: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Button Link
              </label>
              <input
                type="text"
                value={content.buttonLink || ""}
                onChange={(e) =>
                  updateSectionContent(selectedSection.id, {
                    buttonLink: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const getSectionTitle = (section) => {
    return section.content?.title || section.type.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5138ee] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading career page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => {
              if (hasUnsavedChanges) {
                if (
                  confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                  )
                ) {
                  router.back();
                }
              } else {
                router.back();
              }
            }}
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">Edit Careers Page</h1>
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600">• Unsaved changes</span>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving || !hasUnsavedChanges}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          {/* Theme Settings */}
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold mb-4">Theme</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Primary Color</label>
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    updateThemeColor("primaryColor", e.target.value)
                  }
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Secondary Color</label>
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateThemeColor("secondaryColor", e.target.value)
                  }
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Text Color</label>
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) =>
                    updateThemeColor("textColor", e.target.value)
                  }
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Background Color</label>
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    updateThemeColor("backgroundColor", e.target.value)
                  }
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Sections</h3>
              <div className="relative group">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <PlusIcon className="w-5 h-5" />
                </button>
                <div className="absolute right-0 w-56 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
                  <button
                    onClick={() => addSection("IMAGE_TEXT")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Image + Text Section
                  </button>
                  <button
                    onClick={() => addSection("IMAGE_BANNER")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Hero Banner
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                    selectedSection?.id === section.id
                      ? "bg-[#5138ee]/10 border-[#5138ee]"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSection(section)}
                >
                  <GripVerticalIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium truncate">
                    {getSectionTitle(section)}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {section.type !== "JOB_LIST" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2Icon className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(index, "up");
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={index === 0}
                    >
                      <ChevronUpIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(index, "down");
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          {renderSettingsPanel()}
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-5xl mx-auto bg-white shadow-xl">
            {sections.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
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
        </div>
      </div>
    </div>
  );
};

export default CareersPageEditor;
