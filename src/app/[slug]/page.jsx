"use client";

import { uploadData } from "@aws-amplify/storage";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { updateCompanyAPI } from "../../services/handleApi";
import { fetchCompany } from "../../store/slices/companySlice";
import { getMediaUrl } from "../../utils/helper";

const CompanyPage = () => {
  const dispatch = useDispatch();
  const { company: initialCompany } = useSelector((state) => state.company);
  const [formData, setFormData] = useState({
    name: initialCompany?.name || "",
    email: initialCompany?.email || "",
    logoUrl: initialCompany?.logoUrl || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await uploadData({
          path: `public/company/${file.name}`,
          data: file,
          options: {
            contentType: file.type,
          },
        }).result;

        setFormData((prev) => ({
          ...prev,
          logoUrl: result.path,
        }));
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateCompanyAPI({
        id: initialCompany?.id,
        ...formData,
      });
      dispatch(fetchCompany(initialCompany?.id));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-semibold text-black">
              Company Profile
            </h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300">
                    {formData.logoUrl ? (
                      <img
                        src={getMediaUrl(formData.logoUrl)}
                        alt="Company logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="ml-4">
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                      {formData.logoUrl ? "Change" : "Upload"}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              <Input
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />

              <div className="pt-4 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: initialCompany?.name,
                      logoUrl: initialCompany?.logoUrl,
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-row pt-4 items-center gap-6">
              {initialCompany?.logoUrl ? (
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                  <Image
                    src={getMediaUrl(initialCompany?.logoUrl)}
                    alt={`${initialCompany?.name} logo`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-md font-medium text-gray-500">
                    Name:
                  </span>
                  <span className="text-md text-gray-900">
                    {initialCompany?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-md font-medium text-gray-500">
                    Email:
                  </span>
                  <span className="text-md text-gray-900">
                    {initialCompany?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-md font-medium text-gray-500">
                    Careers Page:
                  </span>
                  <a
                    href={`/${initialCompany?.slug}/careers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md text-blue-600 hover:underline"
                  >
                    Click here
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyPage;
