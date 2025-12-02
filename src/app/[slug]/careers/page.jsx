"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PreviewPanel from "../../../components/partials/PreviewPanel";
import { getCareerPageBySlugAPI } from "../../../services/handleApi";

const CareersPage = () => {
  const params = useParams();
  const { slug } = params || {};
  const [company, setCompany] = useState(null);
  const [theme, setTheme] = useState(null);
  const [sections, setSections] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const result = await getCareerPageBySlugAPI(slug);

      setCompany(result?.company);
      setJobs(result?.jobs);
      setTheme(result?.theme);
      setSections(result?.sections);
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PreviewPanel
        sections={sections}
        theme={theme}
        jobs={jobs}
        isCareersPage={true}
      />
    </div>
  );
};

export default CareersPage;
