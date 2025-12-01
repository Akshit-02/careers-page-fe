"use client";

import { uploadData } from "@aws-amplify/storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  getCompanyBySlugAPI,
  updateCompanyAPI,
} from "../../services/handleApi";
import { fetchCompany } from "../../store/slices/companySlice";
import { debounce, generateSlug, getMediaUrl } from "../../utils/helper";

const OnboardingPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { company } = useSelector((state) => state.company);
  const [formData, setFormData] = useState({
    name: company?.name || "",
    slug: company?.slug || "",
    logoUrl: company?.logoUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const checkSlugAvailability = async (slug) => {
    if (!slug) return;

    setIsCheckingSlug(true);
    try {
      const company = await getCompanyBySlugAPI(slug);
      if (company) {
        setSlugError(
          "This URL is already taken. Please choose a different one."
        );
      } else {
        setSlugError("");
      }
    } catch (error) {
      console.error("Error checking slug:", error);
      setSlugError("Error checking URL availability. Please try again.");
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const debouncedCheckSlug = useCallback(
    debounce((slug) => checkSlugAvailability(slug), 500),
    []
  );

  const handleNameChange = (e) => {
    const name = e.target.value;
    const newSlug = generateSlug(name);

    setFormData((prev) => ({
      ...prev,
      name,
      slug: newSlug,
    }));

    if (newSlug) {
      debouncedCheckSlug(newSlug);
    }
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value;
    setFormData((prev) => ({
      ...prev,
      slug,
    }));

    if (slug) {
      debouncedCheckSlug(slug);
    } else {
      setSlugError("URL is required");
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (slugError) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: company?.id,
        name: formData.name,
        slug: formData.slug,
        logoUrl: formData.logoUrl,
        onBoardingStepCompleted: "ON_BOARDING_COMPLETED",
      };
      await updateCompanyAPI(payload);
      dispatch(fetchCompany(company?.id));
      router.push(`/${company?.slug}`);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5138ee]/10 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8 md:p-10 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-[#5138ee] mb-8">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            name="name"
            label="Company Name"
            value={formData.name}
            onChange={handleNameChange}
            required
            placeholder="Enter company name"
          />

          <div>
            <Input
              id="slug"
              name="slug"
              label="Company URL"
              value={formData.slug}
              onChange={handleSlugChange}
              required
              pattern="[a-z0-9-]+$"
              title="Only lowercase letters, numbers, and hyphens are allowed"
              placeholder="your-company"
              className="mb-1"
              error={slugError}
              disabled={isCheckingSlug}
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be your public URL. Only lowercase letters, numbers, and
              hyphens are allowed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {formData.logoUrl ? (
                  <img
                    src={getMediaUrl(formData.logoUrl)}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-8 h-8"
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

          <Button
            type="submit"
            variant="primary"
            size="full"
            isLoading={isLoading || isCheckingSlug}
            disabled={!!slugError || isCheckingSlug}
            className="mt-2"
          >
            Save and Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
