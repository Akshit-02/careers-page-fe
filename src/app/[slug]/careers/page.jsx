"use client";

import { getMediaUrl } from "../../../utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCareerPageSectionByCompanyIdAPI,
  getCareerPageSectionContentBySectionIdAPI,
  getCompanyBySlugAPI,
  getThemeSettingByCompanyIdAPI,
} from "../../../services/handleApi";

const CareersPage = () => {
  const params = useParams();
  const { slug } = params || {};
  const [company, setCompany] = useState(null);
  const [theme, setTheme] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const fetchCompany = async () => {
    try {
      const companyRes = await getCompanyBySlugAPI(slug);
      setCompany(companyRes);
      if (companyRes?.id) {
        const themeRes = await getThemeSettingByCompanyIdAPI(companyRes.id);
        setTheme(themeRes);

        const sectionsData = await getCareerPageSectionByCompanyIdAPI(
          companyRes.id
        );

        if (sectionsData && sectionsData.length > 0) {
          // Fetch content for each section
          const sectionsWithContent = await Promise.all(
            sectionsData.map(async (section) => {
              const content = await getCareerPageSectionContentBySectionIdAPI(
                section.id
              );
              return {
                ...section,
                content: content || {},
              };
            })
          );

          // Sort by order
          const sortedSections = sectionsWithContent.sort(
            (a, b) => a.order - b.order
          );
          setSections(sortedSections);
        }
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const renderImageBannerPreview = (section) => {
    const { content } = section;
    return (
      <div
        className="relative h-96 bg-cover bg-center cursor-pointer"
        style={{
          backgroundImage: content.imageUrl
            ? `url(${getMediaUrl(content.imageUrl)})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
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
      <div className="p-12 cursor-pointer transition-all bg-white">
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
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCardGridPreview = (section) => {
    const { content } = section;
    let cards = [];

    try {
      cards = content.cards ? JSON.parse(content.cards) : [];
    } catch (e) {
      console.error("Error parsing cards:", e);
    }

    return (
      <div className="p-12 bg-gray-50 cursor-pointer transition-all">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: theme.primaryColor }}
        >
          {content.title || "Benefits"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJobListPreview = (section) => {
    const { content } = section;
    return (
      <div className="p-12 cursor-pointer transition-all bg-white">
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: theme.primaryColor }}
        >
          {content.title || "Open Positions"}
        </h2>
        <div className="space-y-4">
          {[
            "Senior Software Engineer",
            "Product Designer",
            "Marketing Manager",
          ].map((job, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{job}</h3>
              <p className="text-gray-600">San Francisco, CA • Full-time</p>
            </div>
          ))}
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
      case "CARD_GRID":
        return renderCardGridPreview(section);
      case "JOB_LIST":
        return renderJobListPreview(section);
      default:
        return null;
    }
  };

  return (
    <div>
      {sections.map((section) => (
        <div key={section.id}>{renderSectionPreview(section)}</div>
      ))}
    </div>
  );
};

export default CareersPage;
