import Button from "../../common/Button";

const EditorTopBar = ({ hasUnsavedChanges, saving, onBack, onSave }) => {
  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900" onClick={onBack}>
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Edit Careers Page</h1>
        {hasUnsavedChanges && (
          <span className="text-sm text-orange-600">• Unsaved changes</span>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={onSave} disabled={saving || !hasUnsavedChanges}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>Save</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorTopBar;
