import { getMediaUrl } from "../../../utils/helper";

const ImageTextPreview = ({
  section,
  theme,
  onSelectSection,
  isCareersPage,
}) => {
  const { content } = section;

  return (
    <div
      className={`p-12  ${
        isCareersPage ? "" : "hover:ring-4 transition-all cursor-pointer"
      }`}
      style={{
        backgroundColor: theme.backgroundColor || "#ffffff",
        borderColor: theme.primaryColor || "#5138ee",
      }}
      onClick={() => (!isCareersPage ? onSelectSection(section) : null)}
    >
      {content.title && (
        <h2
          className="text-3xl font-bold mb-4 text-center"
          style={{ color: theme.primaryColor || "#5138ee" }}
        >
          {content.title}
        </h2>
      )}
      {content.description && (
        <p
          className="text-center text-lg mb-4"
          style={{ color: theme.secondaryColor || "#666" }}
        >
          {content.description}
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {content.text && (
          <p
            className="leading-relaxed"
            style={{ color: theme.textColor || "#4b5563" }}
          >
            {content.text}
          </p>
        )}

        {content.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={getMediaUrl(content.imageUrl)}
              alt={content.title}
              className="w-full h-64 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTextPreview;
