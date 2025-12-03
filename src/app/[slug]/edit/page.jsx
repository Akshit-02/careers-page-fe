"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PreviewPanel from "../../../components/partials/PreviewPanel";
import SectionsList from "../../../components/partials/SectionsList";
import SettingsPanel from "../../../components/partials/SettingsPanel";
import ThemeSettings from "../../../components/partials/ThemeSettings";
import {
  createCareerPageSectionAPI,
  createCareerPageSectionContentAPI,
  getCareerPageBySlugAPI,
  updateCareerPageSectionAPI,
  updateCareerPageSectionContentAPI,
  updateThemeSettingAPI,
} from "../../../services/handleApi";
import { getDefaultContentForType } from "../../../utils/helper";
import EditorTopBar from "../../../components/layout/EditorTopBar";

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
  const [newSections, setNewSections] = useState([]);
  const [modifiedSections, setModifiedSections] = useState(new Set());
  const [deletedSections, setDeletedSections] = useState([]);
  const [draggedSection, setDraggedSection] = useState(null);

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
    } catch (error) {
      console.error("Error fetching career page design:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateThemeSettingAPI({
        id: theme.id,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        textColor: theme.textColor,
        backgroundColor: theme.backgroundColor,
      });

      await Promise.all(
        deletedSections.map((sectionId) =>
          updateCareerPageSectionAPI({
            id: sectionId,
            companyId: company.id,
            isArchived: true,
          })
        )
      );

      for (const section of newSections) {
        const createdSection = await createCareerPageSectionAPI({
          id: section.id,
          companyId: company.id,
          type: section.type,
          order: section.order,
          isArchived: false,
        });

        await createCareerPageSectionContentAPI({
          ...section.content,
          sectionId: createdSection.id,
        });
      }

      const sectionsToUpdate = sections.filter(
        (s) =>
          modifiedSections.has(s.id) &&
          !newSections.find((ns) => ns.id === s.id)
      );

      await Promise.all([
        ...sections
          .filter((s) => !deletedSections.includes(s.id))
          .map((section, index) =>
            updateCareerPageSectionAPI({
              id: section.id,
              order: index,
              isArchived: section.isArchived,
            })
          ),
        ...sectionsToUpdate.map((section) =>
          updateCareerPageSectionContentAPI({
            id: section.content.id,
            ...section.content,
          })
        ),
      ]);

      setNewSections([]);
      setModifiedSections(new Set());
      setDeletedSections([]);
      setHasUnsavedChanges(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateThemeColor = (key, value) => {
    setTheme({ ...theme, [key]: value });
    setHasUnsavedChanges(true);
  };

  const addSection = async (type) => {
    const newSectionId = uuidv4();
    const contentId = uuidv4();
    const contentData = getDefaultContentForType(type, newSectionId);

    const newSection = {
      id: newSectionId,
      companyId: company.id,
      type,
      order: sections.length,
      isArchived: false,
      content: {
        id: contentId,
        ...contentData,
      },
    };

    setSections([...sections, newSection]);
    setNewSections((prev) => [...prev, newSection]);
    setHasUnsavedChanges(true);
  };

  const deleteSection = async (id) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    setDeletedSections((prev) => [...prev, id]);
    setSections((prev) => prev.filter((s) => s.id !== id));
    setNewSections((prev) => prev.filter((s) => s.id !== id));

    if (selectedSection?.id === id) {
      setSelectedSection(null);
    }

    setHasUnsavedChanges(true);
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return;

    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    newSections.forEach((section, idx) => {
      section.order = idx;
      setModifiedSections((prev) => new Set(prev).add(section.id));
    });

    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const handleDragStart = (e, index) => {
    setDraggedSection(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedSection === null || draggedSection === index) return;

    const newSections = [...sections];
    const draggedItem = newSections[draggedSection];

    newSections.splice(draggedSection, 1);
    newSections.splice(index, 0, draggedItem);

    newSections.forEach((section, idx) => {
      section.order = idx;
      setModifiedSections((prev) => new Set(prev).add(section.id));
    });

    setSections(newSections);
    setDraggedSection(index);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
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
    setNewSections(
      newSections.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, ...newData } } : s
      )
    );

    setModifiedSections((prev) => new Set(prev).add(id));
    setHasUnsavedChanges(true);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.back();
      }
    } else {
      router.back();
    }
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
      <EditorTopBar
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onBack={handleBack}
        onSave={handleSave}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r overflow-y-auto">
          <ThemeSettings theme={theme} onUpdateColor={updateThemeColor} />

          <SectionsList
            sections={sections}
            selectedSection={selectedSection}
            draggedSection={draggedSection}
            onSelectSection={setSelectedSection}
            onAddSection={addSection}
            onDeleteSection={deleteSection}
            onMoveSection={moveSection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />

          <SettingsPanel
            selectedSection={selectedSection}
            uploading={uploading}
            onClose={() => setSelectedSection(null)}
            onUpdateContent={updateSectionContent}
            setUploading={setUploading}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <PreviewPanel
            sections={sections}
            theme={theme}
            jobs={jobs}
            onSelectSection={setSelectedSection}
          />
        </div>
      </div>
    </div>
  );
};

export default CareersPageEditor;
