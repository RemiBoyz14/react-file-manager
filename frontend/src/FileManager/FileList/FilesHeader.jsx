import { useMemo, useState } from "react";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useSelection } from "../../contexts/SelectionContext";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useTranslation } from "../../contexts/TranslationProvider";

const FilesHeader = ({ unselectFiles }) => {
  const t = useTranslation();
  const [showSelectAll, setShowSelectAll] = useState(false);

  const { selectedFiles, setSelectedFiles } = useSelection();
  const { currentPathFiles } = useFileNavigation();

  const allFilesSelected = useMemo(() => {
    return currentPathFiles.length > 0 && selectedFiles.length === currentPathFiles.length;
  }, [selectedFiles, currentPathFiles]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(currentPathFiles);
      setShowSelectAll(true);
    } else {
      unselectFiles();
    }
  };

  return (
    <div
      className="files-header"
      onMouseOver={() => setShowSelectAll(true)}
      onMouseLeave={() => setShowSelectAll(false)}
    >
      <div className="file-select-all">
        {(showSelectAll || allFilesSelected) && (
          <Checkbox checked={allFilesSelected} onChange={handleSelectAll} title="Select all" disabled={currentPathFiles.length === 0} />
        )}
      </div>
      <div className="file-name">{t("name")}</div>
      <div className="file-date">{t("modified")}</div>
      <div className="file-size">{t("size")}</div>
    </div>
  );
};

export default FilesHeader;
