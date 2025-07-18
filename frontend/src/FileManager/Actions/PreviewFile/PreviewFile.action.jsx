import React, { useMemo, useState } from "react";
import { getFileExtension } from "../../../utils/getFileExtension";
import Loader from "../../../components/Loader/Loader";
import { useSelection } from "../../../contexts/SelectionContext";
import Button from "../../../components/Button/Button";
import { getDataSize } from "../../../utils/getDataSize";
import { MdOutlineFileDownload } from "react-icons/md";
import { useFileIcons } from "../../../hooks/useFileIcons";
import { FaRegFileAlt } from "react-icons/fa";
import { useTranslation } from "../../../contexts/TranslationProvider";
import "./PreviewFile.action.scss";

const imageExtensions = ["jpg", "jpeg", "png"];
const videoExtensions = ["mp4", "mov", "avi"];
const audioExtensions = ["mp3", "wav", "m4a"];
const iFrameExtensions = ["txt", "pdf"];

const PreviewFileAction = ({ filePreviewPath, filePreviewComponent }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { selectedFiles } = useSelection();
  const fileIcons = useFileIcons(73);
  const extension = getFileExtension(selectedFiles[0].name)?.toLowerCase();
  const filePath = `${filePreviewPath}${selectedFiles[0].path}`;
  const t = useTranslation();

  // Custom file preview component
  const customPreview = useMemo(
    () => filePreviewComponent?.(selectedFiles[0]),
    [filePreviewComponent]
  );

  const handleImageLoad = () => {
    setIsLoading(false); // Loading is complete
    setHasError(false); // No error
  };

  const handleImageError = () => {
    setIsLoading(false); // Loading is complete
    setHasError(true); // Error occurred
  };

  const handleDownload = () => {
    window.location.href = filePath;
  };

  if (React.isValidElement(customPreview)) {
    return customPreview;
  }

  return (
    <section className={`file-previewer ${extension === "pdf" ? "pdf-previewer" : ""}`}>
      {hasError ||
        (![
          ...imageExtensions,
          ...videoExtensions,
          ...audioExtensions,
          ...iFrameExtensions,
        ].includes(extension) && (
          <div className="preview-error">
            <span className="error-icon">{fileIcons[extension] ?? <FaRegFileAlt size={73} />}</span>
            <span className="error-msg">{t("previewUnavailable")}</span>
            <div className="file-info">
              <span className="file-name">{selectedFiles[0].name}</span>
              {selectedFiles[0].size && <span>-</span>}
              <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
            </div>
          </div>
        ))}
      {imageExtensions.includes(extension) && (
        <>
          <Loader isLoading={isLoading} />
          <img
            src={filePath}
            alt="Preview Unavailable"
            className={`photo-popup-image ${isLoading ? "img-loading" : ""}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      )}
      {videoExtensions.includes(extension) && (
        <video src={filePath} className="video-preview" controls autoPlay />
      )}
      {audioExtensions.includes(extension) && (
        <audio src={filePath} controls autoPlay className="audio-preview" />
      )}
      {iFrameExtensions.includes(extension) && (
        <>
          <iframe
            src={filePath}
            onLoad={handleImageLoad}
            onError={handleImageError}
            frameBorder="0"
            className={`photo-popup-iframe ${isLoading ? "img-loading" : ""}`}
          ></iframe>
        </>
      )}
    </section>
  );
};

export default PreviewFileAction;
