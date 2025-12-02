export const getMediaUrl = (key) => {
  return `https://careers-page-dev-media-assets.s3.ap-south-1.amazonaws.com/${key}`;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getDefaultContentForType = (type, sectionId) => {
  const baseContent = {
    sectionId,
    title: null,
    description: null,
    text: null,
    buttonText: null,
    buttonLink: null,
    imageUrl: null,
  };

  switch (type) {
    case "IMAGE_BANNER":
      return {
        ...baseContent,
        title: "New Hero Section",
        description: "Add your tagline here",
        buttonText: "Get Started",
        imageUrl: "public/common/default-banner.jpg",
      };
    case "IMAGE_TEXT":
      return {
        ...baseContent,
        title: "New Content Section",
        description: "Add a brief description",
        text: "Add your detailed content here",
        imageUrl: "public/common/default-image.jpg",
      };
    case "JOB_LIST":
      return {
        ...baseContent,
        title: "Open Positions",
      };
    default:
      return baseContent;
  }
};
