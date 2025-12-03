import { getMediaUrl } from "../../../utils/helper";

const ImageBannerPreview = ({
  section,
  theme,
  onSelectSection,
  isCareersPage,
}) => {
  const { content } = section;

  return (
    <div
      className={`relative h-96 bg-cover bg-center  ${
        isCareersPage ? "" : "hover:ring-4 transition-all cursor-pointer"
      }`}
      style={{
        backgroundImage: content.imageUrl
          ? `url(${getMediaUrl(content.imageUrl)})`
          : `linear-gradient(135deg, ${theme.primaryColor || "#667eea"} 0%, ${
              theme.secondaryColor || "#764ba2"
            } 100%)`,
        borderColor: theme.primaryColor || "#5138ee",
      }}
      onClick={() => (!isCareersPage ? onSelectSection(section) : null)}
    >
      <div className="absolute inset-0 text-white bg-black bg-opacity-40 flex flex-col items-center justify-center p-8">
        {content.title && (
          <h1 className="text-5xl font-bold mb-4 text-center">
            {content.title}
          </h1>
        )}
        {content.description && (
          <p className="text-xl mb-8 text-center">{content.description}</p>
        )}
        {content.buttonText && (
          <button
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              backgroundColor: theme.primaryColor || "#5138ee",
              color: theme.backgroundColor || "#ffffff",
            }}
          >
            {content.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageBannerPreview;
