"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  X,
  File,
  Sheet,
  FileText,
  Image,
  FileArchive,
  Table,
} from "lucide-react";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Progress } from "@/src/app/components/ui/progress";
import { toast } from "sonner";

type MultiFileUploadProps = {
  fileLimit?: number;
  maxFileSize?: number;
  onFilesSelected?: (files: File[]) => void;
  onUploadClick?: (files: File[]) => void;
  multiFile?: boolean;
  disabled?: boolean;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  buttonRemoveLabel?: string;
  maxFilesContainerHeight?: number;
  errorSizeMessage?: string;
  allowedExtensions?: string[];
  onError?: (error: any) => void;
  showPlaceholderImage?: boolean;
  ContainerProps?: {
    sx?: any;
  };
  classes?: {
    smallText?: string;
    smallTextUnder?: string;
  };
};

// Function to map extensions to MIME types
const getAcceptObjectFromExtensions = (
  extensions: string[]
): Record<string, string[]> => {
  const acceptMap: Record<string, string[]> = {};

  extensions.forEach((ext) => {
    const cleanExt = ext.toLowerCase().replace(/^\./, "");

    switch (cleanExt) {
      case "xlsx":
        acceptMap[
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ] = [".xlsx"];
        break;
      case "xls":
        acceptMap["application/vnd.ms-excel"] = [".xls"];
        break;
      case "csv":
        acceptMap["text/csv"] = [".csv"];
        break;
      case "pdf":
        acceptMap["application/pdf"] = [".pdf"];
        break;
      case "doc":
        acceptMap["application/msword"] = [".doc"];
        break;
      case "docx":
        acceptMap[
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ] = [".docx"];
        break;
      case "ppt":
        acceptMap["application/vnd.ms-powerpoint"] = [".ppt"];
        break;
      case "pptx":
        acceptMap[
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ] = [".pptx"];
        break;
      case "txt":
        acceptMap["text/plain"] = [".txt"];
        break;
      case "dbf":
        acceptMap["application/dbase"] = [".dbf"];
        acceptMap["application/x-dbf"] = [".dbf"];
        break;
      case "png":
        acceptMap["image/png"] = [".png"];
        break;
      case "jpg":
      case "jpeg":
        acceptMap["image/jpeg"] = [".jpg", ".jpeg"];
        break;
      case "gif":
        acceptMap["image/gif"] = [".gif"];
        break;
      case "zip":
        acceptMap["application/zip"] = [".zip"];
        break;
      case "rar":
        acceptMap["application/vnd.rar"] = [".rar"];
        break;
      default:
        // For unknown extensions, use a generic type
        acceptMap["application/octet-stream"] = [`.${cleanExt}`];
    }
  });

  return acceptMap;
};

// Function to get file icon based on extension
const getFileIcon = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "xlsx":
    case "xls":
      return <Sheet className="w-5 h-5 text-green-600" />;
    case "pdf":
      return <FileText className="w-5 h-5 text-red-600" />;
    case "doc":
    case "docx":
      return <FileText className="w-5 h-5 text-blue-600" />;
    case "ppt":
    case "pptx":
      return <FileText className="w-5 h-5 text-orange-600" />;
    case "txt":
      return <FileText className="w-5 h-5 text-gray-600" />;
    case "csv":
      return <Table className="w-5 h-5 text-green-500" />;
    case "dbf":
      return <FileArchive className="w-5 h-5 text-purple-600" />;
    case "zip":
    case "rar":
      return <FileArchive className="w-5 h-5 text-yellow-600" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <Image className="w-5 h-5 text-purple-600" />;
    default:
      return <File className="w-5 h-5 text-gray-600" />;
  }
};

export default function MultiFileUpload({
  fileLimit = 5,
  maxFileSize = 10,
  onFilesSelected,
  onUploadClick,
  multiFile = true,
  disabled = false,
  leftLabel,
  rightLabel,
  buttonLabel,
  buttonRemoveLabel = "Clear all",
  maxFilesContainerHeight = 500,
  errorSizeMessage,
  allowedExtensions = [],
  onError,
  showPlaceholderImage = true,
  ContainerProps,
  classes = {},
}: MultiFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate accept object from allowedExtensions
  const dropzoneAccept =
    allowedExtensions.length > 0
      ? getAcceptObjectFromExtensions(allowedExtensions)
      : undefined;

  const validateFile = (file: File): string | null => {
    // File size validation
    if (file.size > maxFileSize * 1024 * 1024) {
      return errorSizeMessage || `File size must be less than ${maxFileSize}MB`;
    }

    // File extension validation
    if (allowedExtensions && allowedExtensions.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isExtensionAllowed = allowedExtensions.some((ext) => {
        const normalizedExt = ext.toLowerCase().replace(/^\./, "");
        return fileExtension === normalizedExt;
      });

      if (!isExtensionAllowed) {
        return `File type not allowed. Allowed types: ${allowedExtensions.join(
          ", "
        )}`;
      }
    }

    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          let errorMessage = "File rejected";

          if (errors[0]?.code === "file-too-large") {
            errorMessage = `File is too large. Maximum size is ${maxFileSize}MB`;
          } else if (errors[0]?.code === "file-invalid-type") {
            errorMessage = `File type not allowed. Allowed types: ${allowedExtensions.join(
              ", "
            )}`;
          }

          setErrors((prev) => ({ ...prev, [file.name]: errorMessage }));
          onError?.(new Error(errorMessage));
          toast.error(errorMessage);
        });
      }

      // Handle accepted files
      const validFiles: File[] = [];
      const newErrors: Record<string, string> = { ...errors };

      acceptedFiles.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          newErrors[file.name] = validationError;
          onError?.(new Error(validationError));
          toast.error(validationError);
        } else {
          validFiles.push(file);
          delete newErrors[file.name];
        }
      });

      setErrors(newErrors);

      if (validFiles.length === 0) return;

      let newFiles = multiFile ? [...files, ...validFiles] : validFiles;

      // Apply file limit
      if (newFiles.length > fileLimit) {
        const excessCount = newFiles.length - fileLimit;
        newFiles = newFiles.slice(0, fileLimit);
        const errorMsg = `Maximum ${fileLimit} files allowed. ${excessCount} files were not added.`;
        onError?.(new Error(errorMsg));
        toast.error(errorMsg);
      }

      setFiles(newFiles);
      onFilesSelected?.(newFiles);

      // Simulate upload progress
      validFiles.forEach((file) => {
        let prog = 0;
        const interval = setInterval(() => {
          prog += 10;
          setProgress((prev) => ({ ...prev, [file.name]: prog }));
          if (prog >= 100) clearInterval(interval);
        }, 200);
      });
    },
    [
      files,
      fileLimit,
      maxFileSize,
      multiFile,
      onFilesSelected,
      onError,
      allowedExtensions,
      errorSizeMessage,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: multiFile,
    disabled: disabled,
    accept: dropzoneAccept,
    maxSize: maxFileSize * 1024 * 1024,
  });

  const removeFile = (name: string) => {
    const newFiles = files.filter((f) => f.name !== name);
    setFiles(newFiles);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    onFilesSelected?.(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setProgress({});
    setErrors({});
    onFilesSelected?.([]);
  };

  const containerSx = ContainerProps?.sx || {
    p: 1,
    border: "2px dashed #e0e0e0",
    backgroundColor: "white",
  };

  const getDefaultLabels = () => (
    <p className="text-sm text-muted-foreground">
      {leftLabel || "Drag and drop or"}{" "}
      <span className="text-primary font-medium underline">
        {buttonLabel || "click here"}
      </span>{" "}
      {rightLabel || "to select files"}
    </p>
  );

  const getAcceptedExtensionsText = () => {
    if (!allowedExtensions || allowedExtensions.length === 0) {
      return "All file types";
    }
    return allowedExtensions.join(", ");
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex flex-col items-center mb-4">
        <Button
          size="sm"
          variant="default"
          onClick={() => onUploadClick?.(files)}
          disabled={disabled || files.length === 0}
        >
          <UploadCloud className="mr-2 w-6 h-6" />
          UPLOAD FILES
        </Button>
      </div>

      {/* File Dropzone */}
      <Card className="w-full rounded-2xl p-6 border-2 border-dashed shadow-sm">
        <CardContent className="p-0 pt-4">
          {files.length > 0 && (
            <span className="text-sm text-muted-foreground mb-4 flex flex-col items-end">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
          )}

          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${isDragActive ? "border-primary bg-muted/40" : "border-muted"}`}
          >
            <input {...getInputProps()} />
            {showPlaceholderImage && (
              <UploadCloud className="text-muted-foreground mb-3 w-20 h-20" />
            )}
            {getDefaultLabels()}
            <p className="text-xs text-muted-foreground mt-1">
              Up to {fileLimit} files, max {maxFileSize}MB each
              {allowedExtensions.length > 0 &&
                ` • Allowed: ${getAcceptedExtensionsText()}`}
            </p>
          </div>

          {files.length > 0 && (
            <div
              className="mt-6 space-y-3"
              style={{
                maxHeight: maxFilesContainerHeight,
                overflowY: "auto",
              }}
            >
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between bg-muted/30 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {errors[file.name] && (
                        <p className="text-xs text-red-500">
                          {errors[file.name]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {progress[file.name] !== undefined && (
                      <Progress value={progress[file.name]} className="w-20" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.name)}
                      disabled={disabled}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAll}
                disabled={disabled}
                className="mt-2"
              >
                {buttonRemoveLabel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
