import { generateClient } from "aws-amplify/api";
import {
  createCareerPageSection,
  createCareerPageSectionContent,
  createJob,
  getCareerPageSectionByCompanyId,
  getCareerPageSectionContentBySectionId,
  getCompanyById,
  getCompanyBySlug,
  getJobsByCompanyId,
  getThemeSettingByCompanyId,
  updateCareerPageSection,
  updateCareerPageSectionContent,
  updateCompany,
  updateJob,
  updateThemeSetting,
} from "./api";

const client = generateClient();

export const getCompanyByIdAPI = async (id) => {
  const response = await client.graphql({
    query: getCompanyById,
    variables: {
      id,
    },
    authMode: "userPool",
  });

  return response.data.getCompanyById;
};

export const getCompanyBySlugAPI = async (slug) => {
  const response = await client.graphql({
    query: getCompanyBySlug,
    variables: {
      slug,
    },
    authMode: "userPool",
  });

  return response.data.getCompanyBySlug.items?.[0];
};

export const updateCompanyAPI = async (input) => {
  const response = await client.graphql({
    query: updateCompany,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.updateCompany;
};

export const createJobAPI = async (input) => {
  const response = await client.graphql({
    query: createJob,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.createJob;
};

export const updateJobAPI = async (input) => {
  const response = await client.graphql({
    query: updateJob,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.updateJob;
};

export const getJobsByCompanyIdAPI = async (companyId) => {
  const response = await client.graphql({
    query: getJobsByCompanyId,
    variables: {
      companyId,
    },
    authMode: "userPool",
  });

  return response.data.getJobsByCompanyId.items;
};

export const getThemeSettingByCompanyIdAPI = async (companyId) => {
  const response = await client.graphql({
    query: getThemeSettingByCompanyId,
    variables: {
      companyId,
    },
    authMode: "userPool",
  });

  return response.data.getThemeSettingByCompanyId.items?.[0];
};

export const updateThemeSettingAPI = async (input) => {
  const response = await client.graphql({
    query: updateThemeSetting,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.updateThemeSetting;
};

export const getCareerPageSectionByCompanyIdAPI = async (companyId) => {
  const response = await client.graphql({
    query: getCareerPageSectionByCompanyId,
    variables: {
      companyId,
    },
    authMode: "userPool",
  });

  return response.data.getCareerPageSectionByCompanyId.items;
};

export const createCareerPageSectionAPI = async (input) => {
  const response = await client.graphql({
    query: createCareerPageSection,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.createCareerPageSection;
};

export const updateCareerPageSectionAPI = async (input) => {
  const response = await client.graphql({
    query: updateCareerPageSection,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.updateCareerPageSection;
};

export const getCareerPageSectionContentBySectionIdAPI = async (sectionId) => {
  const response = await client.graphql({
    query: getCareerPageSectionContentBySectionId,
    variables: {
      sectionId,
    },
    authMode: "userPool",
  });

  return response.data.getCareerPageSectionContentBySectionId.items?.[0];
};

export const createCareerPageSectionContentAPI = async (input) => {
  const response = await client.graphql({
    query: createCareerPageSectionContent,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.createCareerPageSectionContent;
};

export const updateCareerPageSectionContentAPI = async (input) => {
  const response = await client.graphql({
    query: updateCareerPageSectionContent,
    variables: {
      input,
    },
    authMode: "userPool",
  });

  return response.data.updateCareerPageSectionContent;
};
