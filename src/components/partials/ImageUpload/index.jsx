import { getMediaUrl } from "../../../utils/helper";

const ImageUpload = ({ imageUrl, uploading, onUpload }) => {
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    await onUpload(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Image</label>
      <div className="space-y-3">
        {imageUrl && (
          <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={getMediaUrl(imageUrl)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer transition-colors ${
            uploading
              ? "bg-gray-100 cursor-not-allowed"
              : "hover:bg-gray-50 hover:border-[#5138ee]"
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5138ee]"></div>
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">
              {imageUrl ? "Change Image" : "Upload Image"}
            </span>
          )}
        </label>
        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF (max 5MB)
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
