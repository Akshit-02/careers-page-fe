import { uploadData } from "aws-amplify/storage";
import { SettingsIcon } from "../../../utils/icons";
import ImageUpload from "../ImageUpload";

const SettingsPanel = ({
  selectedSection,
  uploading,
  onClose,
  onUpdateContent,
  setUploading,
}) => {
  if (!selectedSection) {
    return (
      <div className="p-6 text-gray-500 text-center">
        <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>Click on a section in the preview to edit it</p>
      </div>
    );
  }

  const { content, type } = selectedSection;

  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      const result = await uploadData({
        path: `public/company/${file.name}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      onUpdateContent(selectedSection.id, { imageUrl: result.path });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {type.replace(/_/g, " ")} Settings
        </h3>
        <button onClick={onClose} className="text-gray-900">
          ✕
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) =>
            onUpdateContent(selectedSection.id, { title: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {(type === "IMAGE_BANNER" || type === "IMAGE_TEXT") && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={content.description || ""}
              onChange={(e) =>
                onUpdateContent(selectedSection.id, {
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <ImageUpload
            imageUrl={content.imageUrl}
            uploading={uploading}
            onUpload={handleImageUpload}
          />
        </>
      )}

      {type === "IMAGE_TEXT" && (
        <div>
          <label className="block text-sm font-medium mb-2">Body Text</label>
          <textarea
            value={content.text || ""}
            onChange={(e) =>
              onUpdateContent(selectedSection.id, { text: e.target.value })
            }
            rows={6}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {type === "IMAGE_BANNER" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={content.buttonText || ""}
              onChange={(e) =>
                onUpdateContent(selectedSection.id, {
                  buttonText: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Button Link
            </label>
            <input
              type="text"
              value={content.buttonLink || ""}
              onChange={(e) =>
                onUpdateContent(selectedSection.id, {
                  buttonLink: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPanel;
