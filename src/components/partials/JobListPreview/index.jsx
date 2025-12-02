import Input from "../../common/Input";
import Select from "../../common/Select";
import {
  departmentOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  workPolicyOptions,
} from "../../../utils/common";

const JobListPreview = ({
  section,
  theme,
  jobs,
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onSelectSection,
  isCareersPage,
}) => {
  const { content } = section;

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

  return (
    <div
      className={`p-12 ${
        isCareersPage ? "" : "cursor-pointer hover:ring-4 transition-all"
      }`}
      style={{
        backgroundColor: theme.backgroundColor || "#ffffff",
        borderColor: theme.primaryColor || "#5138ee",
      }}
      onClick={() => (!isCareersPage ? onSelectSection(section) : null)}
    >
      <h2
        className="text-3xl text-center font-bold mb-8"
        style={{ color: theme.primaryColor || "#5138ee" }}
      >
        {content.title || "Open Positions"}
      </h2>
      <div className="mb-4">
        <Input
          placeholder="Search jobs..."
          className="w-full"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            borderColor: theme.secondaryColor,
            color: theme.textColor,
          }}
        />
      </div>
      <div className="hidden sm:flex flex-row gap-4">
        <Select
          options={workPolicyOptions}
          placeholder="Filter by work policy"
          className="w-full"
          value={filters.workPolicy}
          onChange={(e) =>
            onFilterChange({ ...filters, workPolicy: e.target.value })
          }
          style={{
            borderColor: theme.secondaryColor,
            color: theme.textColor,
          }}
        />
        <Select
          options={departmentOptions}
          placeholder="Filter by department"
          className="w-full"
          value={filters.department}
          onChange={(e) =>
            onFilterChange({ ...filters, department: e.target.value })
          }
          style={{
            borderColor: theme.secondaryColor,
            color: theme.textColor,
          }}
        />
        <Select
          options={employmentTypeOptions}
          placeholder="Filter by employment type"
          className="w-full"
          value={filters.employmentType}
          onChange={(e) =>
            onFilterChange({ ...filters, employmentType: e.target.value })
          }
          style={{
            borderColor: theme.secondaryColor,
            color: theme.textColor,
          }}
        />
        <Select
          options={experienceLevelOptions}
          placeholder="Filter by experience level"
          className="w-full"
          value={filters.experienceLevel}
          onChange={(e) =>
            onFilterChange({ ...filters, experienceLevel: e.target.value })
          }
          style={{
            borderColor: theme.secondaryColor,
            color: theme.textColor,
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <tbody>
            {filteredJobs?.map((job) => (
              <tr
                key={job.id}
                className="border-b transition-colors"
                style={{
                  borderColor: theme.secondaryColor + "40",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme.primaryColor + "10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className="p-4 flex flex-col">
                  <span
                    className="font-medium"
                    style={{ color: theme.textColor || "#1f2937" }}
                  >
                    {job.title}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: theme.secondaryColor || "#6b7280" }}
                  >
                    {new Date(job.createdAt).toLocaleDateString()}{" "}
                  </span>
                </td>

                <td
                  className="p-4"
                  style={{ color: theme.textColor || "#1f2937" }}
                >
                  {workPolicyOptions.find(
                    (option) => option.value === job.workPolicy
                  )?.label || job.workPolicy}
                </td>
                <td
                  className="p-4"
                  style={{ color: theme.textColor || "#1f2937" }}
                >
                  {job.location}
                </td>
                <td
                  className="p-4"
                  style={{ color: theme.textColor || "#1f2937" }}
                >
                  {departmentOptions.find(
                    (option) => option.value === job.department
                  )?.label || job.department}
                </td>
                <td
                  className="p-4"
                  style={{ color: theme.textColor || "#1f2937" }}
                >
                  {employmentTypeOptions.find(
                    (option) => option.value === job.employmentType
                  )?.label || job.employmentType}
                </td>
                <td
                  className="p-4"
                  style={{ color: theme.textColor || "#1f2937" }}
                >
                  {experienceLevelOptions.find(
                    (option) => option.value === job.experienceLevel
                  )?.label || job.experienceLevel}
                </td>
              </tr>
            ))}
            {filteredJobs.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-8 text-center"
                  style={{ color: theme.secondaryColor || "#6b7280" }}
                >
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

export default JobListPreview;
