import {
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "../../../utils/icons";

const SectionsList = ({
  sections,
  selectedSection,
  draggedSection,
  onSelectSection,
  onAddSection,
  onDeleteSection,
  onMoveSection,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const getSectionTitle = (section) => {
    return section.content?.title || section.type.replace(/_/g, " ");
  };

  return (
    <div className="px-6 py-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Sections</h3>
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded">
            <PlusIcon className="w-5 h-5" />
          </button>
          <div className="absolute right-0 w-56 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
            <button
              onClick={() => onAddSection("IMAGE_TEXT")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Image + Text Section
            </button>
            <button
              onClick={() => onAddSection("IMAGE_BANNER")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Hero Banner
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-move transition-all ${
              selectedSection?.id === section.id
                ? "bg-[#5138ee]/10 border-[#5138ee]"
                : "bg-gray-50 hover:bg-gray-100"
            } ${
              draggedSection === index
                ? "opacity-50 scale-95"
                : "opacity-100 scale-100"
            }`}
            onClick={() => onSelectSection(section)}
          >
            <GripVerticalIcon className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />
            <span className="flex-1 text-sm font-medium truncate">
              {getSectionTitle(section)}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {section.type !== "JOB_LIST" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(section.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <Trash2Icon className="w-4 h-4 text-red-600" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSection(index, "up");
                }}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={index === 0}
              >
                <ChevronUpIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSection(index, "down");
                }}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={index === sections.length - 1}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionsList;
