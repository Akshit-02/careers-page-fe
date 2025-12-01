export const getCompanyById = /* GraphQL */ `
  query GetCompanyById($id: ID!) {
    getCompanyById(id: $id) {
      id
      email
      logoUrl
      name
      slug
      onBoardingStepCompleted
      createdAt
      updatedAt
    }
  }
`;

export const getCompanyBySlug = /* GraphQL */ `
  query GetCompanyBySlug($slug: String!) {
    getCompanyBySlug(slug: $slug) {
      items {
        id
        logoUrl
        name
        slug
        createdAt
        updatedAt
      }
    }
  }
`;

export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      id
      email
      logoUrl
      name
      slug
      onBoardingStepCompleted
      createdAt
      updatedAt
    }
  }
`;

export const getJobsByCompanyId = /* GraphQL */ `
  query GetJobsByCompanyId($companyId: ID!) {
    getJobsByCompanyId(companyId: $companyId) {
      items {
        id
        companyId
        title
        workPolicy
        location
        department
        employmentType
        experienceLevel
        minSalary
        maxSalary
        currency
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const getThemeSettingByCompanyId = /* GraphQL */ `
  query GetThemeSettingByCompanyId($companyId: ID!) {
    getThemeSettingByCompanyId(companyId: $companyId) {
      items {
        id
        companyId
        primaryColor
        secondaryColor
        textColor
        backgroundColor
      }
    }
  }
`;

export const createJob = /* GraphQL */ `
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      companyId
      title
      workPolicy
      location
      department
      employmentType
      experienceLevel
      minSalary
      maxSalary
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const updateJob = /* GraphQL */ `
  mutation UpdateJob($input: UpdateJobInput!) {
    updateJob(input: $input) {
      id
      companyId
      title
      workPolicy
      location
      department
      employmentType
      experienceLevel
      minSalary
      maxSalary
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const updateThemeSetting = /* GraphQL */ `
  mutation UpdateThemeSetting($input: UpdateThemeSettingInput!) {
    updateThemeSetting(input: $input) {
      id
      primaryColor
      secondaryColor
      textColor
      backgroundColor
    }
  }
`;

export const getCareerPageSectionByCompanyId = /* GraphQL */ `
  query GetCareerPageSectionByCompanyId($companyId: ID!) {
    getCareerPageSectionByCompanyId(companyId: $companyId) {
      items {
        id
        companyId
        type
        order
        isArchived
      }
    }
  }
`;

export const createCareerPageSection = /* GraphQL */ `
  mutation CreateCareerPageSection($input: CreateCareerPageSectionInput!) {
    createCareerPageSection(input: $input) {
      id
      companyId
      type
      order
      isArchived
    }
  }
`;

export const updateCareerPageSection = /* GraphQL */ `
  mutation UpdateCareerPageSection($input: UpdateCareerPageSectionInput!) {
    updateCareerPageSection(input: $input) {
      id
      companyId
      type
      order
      isArchived
    }
  }
`;

export const getCareerPageSectionContentBySectionId = /* GraphQL */ `
  query GetCareerPageSectionContentBySectionId($sectionId: ID!) {
    getCareerPageSectionContentBySectionId(sectionId: $sectionId) {
      items {
        id
        sectionId
        title
        description
        text
        buttonText
        buttonLink
        imageUrl
      }
    }
  }
`;

export const createCareerPageSectionContent = /* GraphQL */ `
  mutation CreateCareerPageSectionContent(
    $input: CreateCareerPageSectionContentInput!
  ) {
    createCareerPageSectionContent(input: $input) {
      id
      sectionId
      title
      description
      text
      buttonText
      buttonLink
      imageUrl
    }
  }
`;

export const updateCareerPageSectionContent = /* GraphQL */ `
  mutation UpdateCareerPageSectionContent(
    $input: UpdateCareerPageSectionContentInput!
  ) {
    updateCareerPageSectionContent(input: $input) {
      id
      sectionId
      title
      description
      text
      buttonText
      buttonLink
      imageUrl
    }
  }
`;

export const getCareerPageBySlug = /* GraphQL */ `
  query GetCareerPageBySlug($slug: String!) {
    getCareerPageBySlug(slug: $slug) {
      company {
        id
        logoUrl
        name
      }
      theme {
        id
        companyId
        primaryColor
        secondaryColor
        textColor
        backgroundColor
      }
      jobs {
        id
        companyId
        title
        workPolicy
        location
        department
        employmentType
        experienceLevel
        minSalary
        maxSalary
        currency
        isActive
        createdAt
      }
      sections {
        id
        companyId
        type
        order
        isArchived
        content {
          id
          sectionId
          title
          description
          text
          buttonText
          buttonLink
          imageUrl
        }
      }
    }
  }
`;
