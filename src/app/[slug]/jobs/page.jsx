"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import JobModal from "../../../components/partials/JobModal";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import {
  createJobAPI,
  getJobsByCompanyIdAPI,
  updateJobAPI,
} from "../../../services/handleApi";
import { formatDate } from "../../../utils/helper";
import {
  departmentOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  workPolicyOptions,
} from "../../../utils/common";
import Switch from "../../../components/common/Switch";

const JobsPage = () => {
  const params = useParams();
  const companyId = params?.slug;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsData = await getJobsByCompanyIdAPI(companyId);
      setJobs(jobsData || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await createJobAPI({
        ...jobData,
        companyId,
        isActive: true,
      });
      setShowJobForm(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      await updateJobAPI({
        ...jobData,
        id: selectedJob.id,
      });
      setSelectedJob(null);
      setShowJobForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleEditClick = (job) => {
    const { createdAt, updatedAt, ...rest } = job;
    setSelectedJob(rest);
    setShowJobForm(true);
  };

  const handleStatusChange = async (jobId, isActive) => {
    try {
      await updateJobAPI({
        id: jobId,
        isActive,
      });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const columns = [
    {
      key: "title",
      title: "Title",
      cellClassName: "font-medium text-gray-900",
    },
    {
      key: "department",
      title: "Department",
      render: (job) =>
        departmentOptions.find((d) => d.value === job.department)?.label || "-",
    },
    {
      key: "location",
      title: "Location",
      render: (job) => job.location || "-",
    },
    {
      key: "workPolicy",
      title: "Work Policy",
      render: (job) =>
        workPolicyOptions.find((t) => t.value === job.workPolicy)?.label || "-",
    },
    {
      key: "type",
      title: "Type",
      render: (job) =>
        employmentTypeOptions.find((t) => t.value === job.employmentType)
          ?.label || "-",
    },
    {
      key: "experience",
      title: "Experience",
      render: (job) =>
        experienceLevelOptions.find((t) => t.value === job.experienceLevel)
          ?.label || "-",
    },
    {
      key: "employmentType",
      title: "Employment Type",
      render: (job) =>
        employmentTypeOptions.find((t) => t.value === job.employmentType)
          ?.label || "-",
    },
    {
      key: "salary",
      title: "Salary",
      render: (job) =>
        job.minSalary && job.maxSalary
          ? `${job.minSalary} - ${job.maxSalary} ${job.currency || "INR"}`
          : "-",
    },
    {
      key: "status",
      title: "Status",
      render: (job) => (
        <Switch
          checked={job.isActive}
          onChange={(e) => handleStatusChange(job.id, e.target.checked)}
        />
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      render: (job) => formatDate(job.createdAt),
    },
    {
      key: "actions",
      title: "Actions",
      render: (job) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(job);
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your company's job postings and applications
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedJob(null);
              setShowJobForm(true);
            }}
          >
            Create Job
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            columns={columns}
            data={jobs}
            loading={loading}
            emptyMessage="No jobs available"
            className="divide-y divide-gray-200"
          />
        </div>

        {showJobForm && (
          <JobModal
            isOpen={showJobForm}
            onClose={() => {
              setShowJobForm(false);
              setSelectedJob(null);
            }}
            job={selectedJob}
            onSave={selectedJob ? handleUpdateJob : handleCreateJob}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
