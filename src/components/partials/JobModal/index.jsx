import { useState } from "react";
import Input from "../../common/Input";
import Modal from "../../common/Modal";
import Select from "../../common/Select";
import Button from "../../common/Button";
import {
  currencyOptions,
  departmentOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  workPolicyOptions,
} from "../../../utils/common";

const JobModal = ({ isOpen, onClose, job, onSave }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    workPolicy: job?.workPolicy || "REMOTE",
    location: job?.location || "",
    department: job?.department || "ENGINEERING",
    employmentType: job?.employmentType || "FULL_TIME",
    experienceLevel: job?.experienceLevel || "JUNIOR_LEVEL",
    minSalary: job?.minSalary || "",
    maxSalary: job?.maxSalary || "",
    currency: job?.currency || "USD",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job?.id ? "Edit Job" : "Create New Job"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <Select
            label="Work Policy"
            name="workPolicy"
            value={formData.workPolicy}
            onChange={handleChange}
            options={workPolicyOptions}
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departmentOptions}
          />

          <Select
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={employmentTypeOptions}
          />

          <Select
            label="Experience Level"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            options={experienceLevelOptions}
          />

          <Input
            label="Min Salary"
            name="minSalary"
            type="number"
            value={formData.minSalary}
            onChange={handleChange}
          />

          <Input
            label="Max Salary"
            name="maxSalary"
            type="number"
            value={formData.maxSalary}
            onChange={handleChange}
          />

          <Select
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            options={currencyOptions}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" type="button" onClick={onClose}>
            Preview
          </Button>
          <Button variant="primary" type="submit">
            {job?.id ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal;
