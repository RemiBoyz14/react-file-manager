import { useEffect, useState } from "react";
import { useDetectOutsideClick } from "../../../hooks/useDetectOutsideClick";
import { duplicateNameHandler } from "../../../utils/duplicateNameHandler";
import NameInput from "../../../components/NameInput/NameInput";
import ErrorTooltip from "../../../components/ErrorTooltip/ErrorTooltip";
import { useFileNavigation } from "../../../contexts/FileNavigationContext";
import { useLayout } from "../../../contexts/LayoutContext";
import { validateApiCallback } from "../../../utils/validateApiCallback";
import { useTranslation } from "../../../contexts/TranslationProvider";

const maxNameLength = 220;

const CreateFileAction = ({ filesViewRef, file, onCreateFile, triggerAction }) => {
  const [fileName, setFileName] = useState(file.name);
  const [fileNameError, setFileNameError] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [errorXPlacement, setErrorXPlacement] = useState("right");
  const [errorYPlacement, setErrorYPlacement] = useState("bottom");
  const outsideClick = useDetectOutsideClick((e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  const { currentFolder, currentPathFiles, setCurrentPathFiles } = useFileNavigation();
  const { activeLayout } = useLayout();
  const t = useTranslation();

  // File name change handler function
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
    setFileNameError(false);
  };
  //

  // Validate file name and call "onCreateFile" function
  const handleValidateFileName = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      handleFileCreating();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      triggerAction.close();
      setCurrentPathFiles((prev) => prev.filter((f) => f.key !== file.key));
      return;
    }

    const invalidCharsRegex = /[\\/:*?"<>|]/;
    if (invalidCharsRegex.test(e.key)) {
      e.preventDefault();
      setFileErrorMessage(t("invalidFileName"));
      setFileNameError(true);
    } else {
      setFileNameError(false);
      setFileErrorMessage("");
    }
  };

  // Auto hide error message after 7 seconds
  useEffect(() => {
    if (fileNameError) {
      const autoHideError = setTimeout(() => {
        setFileNameError(false);
        setFileErrorMessage("");
      }, 7000);

      return () => clearTimeout(autoHideError);
    }
  }, [fileNameError]);
  //

  function handleFileCreating() {
    let newFileName = fileName.trim();
    const syncedCurrPathFiles = currentPathFiles.filter((f) => !(!!f.key && f.key === file.key));

    const alreadyExists = syncedCurrPathFiles.find((f) => {
      return f.name.toLowerCase() === newFileName.toLowerCase();
    });

    if (alreadyExists) {
      setFileErrorMessage(t("fileExists", { renameFile: newFileName }));
      setFileNameError(true);
      outsideClick.ref.current?.focus();
      outsideClick.ref.current?.select();
      outsideClick.setIsClicked(false);
      return;
    }

    if (newFileName === "") {
      newFileName = duplicateNameHandler("New File", true, syncedCurrPathFiles);
    }

    validateApiCallback(onCreateFile, "onCreateFile", newFileName, currentFolder);
    setCurrentPathFiles((prev) => prev.filter((f) => f.key !== file.key));
    triggerAction.close();
  }
  //

  // File name text selection upon visible
  useEffect(() => {
    outsideClick.ref.current?.focus();
    outsideClick.ref.current?.select();

    // Dynamic Error Message Placement based on available space
    if (outsideClick.ref?.current) {
      const errorMessageWidth = 292 + 8 + 8 + 5; // 8px padding on left and right + additional 5px for gap
      const errorMessageHeight = 56 + 20 + 10 + 2; // 20px :before height
      const filesContainer = filesViewRef.current;
      const filesContainerRect = filesContainer.getBoundingClientRect();
      const nameInputContainer = outsideClick.ref.current;
      const nameInputContainerRect = nameInputContainer.getBoundingClientRect();

      const rightAvailableSpace = filesContainerRect.right - nameInputContainerRect.left;
      rightAvailableSpace > errorMessageWidth
        ? setErrorXPlacement("right")
        : setErrorXPlacement("left");

      const bottomAvailableSpace =
        filesContainerRect.bottom - (nameInputContainerRect.top + nameInputContainer.clientHeight);
      bottomAvailableSpace > errorMessageHeight
        ? setErrorYPlacement("bottom")
        : setErrorYPlacement("top");
    }
  }, []);
  //

  useEffect(() => {
    if (outsideClick.isClicked) {
      handleFileCreating();
    }
  }, [outsideClick.isClicked]);

  return (
    <>
      <NameInput
        nameInputRef={outsideClick.ref}
        maxLength={maxNameLength}
        value={fileName}
        onChange={handleFileNameChange}
        onKeyDown={handleValidateFileName}
        onClick={(e) => e.stopPropagation()}
        {...(activeLayout === "list" && { rows: 1 })}
      />
      {fileNameError && (
        <ErrorTooltip
          message={fileErrorMessage}
          xPlacement={errorXPlacement}
          yPlacement={errorYPlacement}
        />
      )}
    </>
  );
};

export default CreateFileAction;
