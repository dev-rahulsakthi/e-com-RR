'use client'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, UploadCloud, File, Download, FileText, Sheet, Image, FileArchive, Table } from 'lucide-react'
import { Button } from '@/src/app/components/ui/button'
import { Card, CardContent } from '@/src/app/components/ui/card'
import { Progress } from '@/src/app/components/ui/progress'
import { Label } from '@/src/app/components/ui/label'
import { toast } from 'sonner'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  onFileRemove?: () => void
  onSampleDownload?: () => void
  isSample?: boolean
  accept?: string // Simplified format: ".xlsx, .csv, .dbf"
  maxSize?: number
  file?: File | null
  fileSrc?: string
  fileName?: string
  uploadProgress?: number
  fileUploadStatus?: string // 'S', 's', 'F', 'f', or any other status
  isUploading?: boolean
  isNoProg?: boolean
  placeHolder?: string
  Note?: React.ReactNode
  children?: React.ReactNode
  height?: string
  width?: string
  alignicon?: boolean
  className?: string
  disabled?: boolean
  label?: string
  description?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileRemove,
  onSampleDownload,
  isSample = false,
  accept = ".xlsx, .csv, .pdf, .doc, .docx, .ppt, .pptx, .txt, .dbf",
  maxSize = 5 * 1024 * 1024,
  file,
  fileSrc,
  fileName,
  uploadProgress = 0,
  fileUploadStatus = '',
  isUploading = false,
  isNoProg = false,
  placeHolder = "Upload",
  Note,
  children,
  height = '100%',
  width = '100%',
  alignicon = false,
  className = '',
  disabled = false,
  label = 'Upload file',
  description = 'Drag & drop your file here'
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle')
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)

  // Convert simplified accept string to react-dropzone format
  const parseAcceptString = (acceptString: string): Record<string, string[]> => {
    const acceptMap: Record<string, string[]> = {}

    // Remove spaces and split by commas
    const extensions = acceptString.split(',').map(ext => ext.trim().toLowerCase())

    extensions.forEach(ext => {
      if (ext.startsWith('.')) {
        const cleanExt = ext.substring(1) // Remove the dot

        // Map extensions to MIME types
        switch (cleanExt) {
          case 'xlsx':
            acceptMap['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx']
            break
          case 'xls':
            acceptMap['application/vnd.ms-excel'] = ['.xls']
            break
          case 'csv':
            acceptMap['text/csv'] = ['.csv']
            break
          case 'pdf':
            acceptMap['application/pdf'] = ['.pdf']
            break
          case 'doc':
            acceptMap['application/msword'] = ['.doc']
            break
          case 'docx':
            acceptMap['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx']
            break
          case 'ppt':
            acceptMap['application/vnd.ms-powerpoint'] = ['.ppt']
            break
          case 'pptx':
            acceptMap['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = ['.pptx']
            break
          case 'txt':
            acceptMap['text/plain'] = ['.txt']
            break
          case 'dbf':
            acceptMap['application/dbase'] = ['.dbf']
            acceptMap['application/x-dbf'] = ['.dbf']
            break
          case 'png':
          case 'jpg':
          case 'jpeg':
          case 'gif':
            acceptMap['image/*'] = [`.${cleanExt}`]
            break
          case 'zip':
          case 'rar':
            acceptMap['application/*'] = [`.${cleanExt}`]
            break
          default:
            acceptMap['application/*'] = [`.${cleanExt}`]
        }
      }
    })

    return acceptMap
  }

  const getFileIcon = (filename?: string, fileType?: string) => {
    if (!filename && !fileType) return <File className="w-24 h-24" />

    const extension = filename?.split('.').pop()?.toLowerCase() || fileType?.toLowerCase()

    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <Sheet className="w-24 h-24 text-green-600" />
      case 'pdf':
        return <FileText className="w-24 h-24 text-red-600" />
      case 'doc':
      case 'docx':
        return <FileText className="w-24 h-24 text-blue-600" />
      case 'ppt':
      case 'pptx':
        return <FileText className="w-24 h-24 text-orange-600" />
      case 'txt':
        return <FileText className="w-24 h-24 text-gray-600" />
      case 'csv':
        return <Table className="w-24 h-24 text-green-500" />
      case 'dbf':
        return <FileArchive className="w-24 h-24 text-purple-600" />
      case 'zip':
      case 'rar':
        return <FileArchive className="w-24 h-24 text-yellow-600" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="w-24 h-24 text-purple-600" />
      default:
        return <File className="w-24 h-24 text-gray-600" />
    }
  }

  const getAcceptedExtensions = (acceptString: string): string => {
    const extensions = acceptString.split(',').map(ext => ext.trim())
    return extensions.join(', ')
  }

  // Start progress animation when file is selected
  const startProgressAnimation = () => {
    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval)
      setProgressInterval(null)
    }

    setCurrentProgress(0)
    setUploadStatus('uploading')

    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          setProgressInterval(null)
          return 90
        }
        return prev + 10
      })
    }, 300)

    setProgressInterval(interval)
  }

  const handleProgressSignal = (signal: string) => {
    if (progressInterval) {
      clearInterval(progressInterval)
      setProgressInterval(null)
    }

    if (signal.toLowerCase() === 's') {
      // Success - set to 100%
      setCurrentProgress(100)
      setUploadStatus('success')
    } else if (signal.toLowerCase() === 'f') {
      // Failure - stop progress and show failed state
      setUploadStatus('failed')
    }
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (acceptedFiles?.length > 1) {
      toast.error("Please upload only one file at a time")
      return
    }

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === 'file-too-large') {
        toast.error(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
      } else if (error.code === 'file-invalid-type') {
        const acceptedExtensions = getAcceptedExtensions(accept)
        toast.error(`Only ${acceptedExtensions} files are allowed`)
      } else {
        toast.error('Error uploading file')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      setUploadStatus('idle')
      // Start progress animation when file is selected
      setTimeout(() => {
        startProgressAnimation()
      }, 100)
      onFileUpload(acceptedFiles[0])
    }
  }, [maxSize, onFileUpload, accept, progressInterval])

  const dropzoneAccept = parseAcceptString(accept)

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
    accept: dropzoneAccept,
    maxSize,
    disabled: disabled || isUploading,
    multiple: false
  })

   useEffect(() => {
    // Listen for fileUploadStatus changes to detect S/s or F signals
    if (fileUploadStatus) {
      const status = fileUploadStatus.trim().toLowerCase()
      if (status === 's' || status === 'f') {
        handleProgressSignal(status)
      }
    }
  }, [fileUploadStatus])

  useEffect(() => {
    return () => {
      // Cleanup interval on unmount
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [progressInterval])

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Cleanup interval
    if (progressInterval) {
      clearInterval(progressInterval)
      setProgressInterval(null)
    }
    setUploadStatus('idle')
    setCurrentProgress(0)
    onFileRemove?.()
  }

  const handleDownloadSample = () => {
    if (onSampleDownload) {
      onSampleDownload()
    } else {
      toast.error("Sample file not available")
    }
  }

  // Determine progress bar color based on status
  const getProgressColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      case 'uploading':
        return 'bg-blue-500'
      default:
        return 'bg-blue-500'
    }
  }

  // Get status message based on upload status
  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'success':
        return 'File uploaded successfully!'
      case 'failed':
        return 'File upload failed!'
      case 'uploading':
        return 'Processing...'
      default:
        return 'Processing...'
    }
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      {/* Header with label + sample download */}
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="dropzone-input" className="text-lg font-bold text-gray-900">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          {isSample && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSample}
              className="h-8 px-3 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample
            </Button>
          )}
          {(file || fileSrc) && !isUploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="h-8 px-3 text-sm text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Card
        className={`
          w-full border-2 border-dashed transition-all duration-200
          ${(file || fileSrc) 
            ? 'border-primary bg-primary/5' 
            : isDragActive 
            ? 'border-primary bg-primary/5' 
            : isDragReject 
            ? 'border-destructive bg-destructive/5'
            : 'border-muted-foreground/25'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          rounded-2xl
          relative
        `}
      >
        <CardContent className="h-full p-8 flex flex-col items-center justify-center">
          <div {...getRootProps()} className="h-full w-full text-center flex flex-col items-center justify-center">
            <input {...getInputProps()} id="dropzone-input" />

            {!(file || fileSrc) ? (
              <div className="space-y-6 py-8 flex flex-col items-center justify-center">
                {children ? (
                  children
                ) : (
                  <>
                    <UploadCloud 
                      className={`w-20 h-20 transition-transform ${
                        isDragActive ? 'scale-110 text-primary' : 'text-muted-foreground'
                      }`} 
                    />
                    <div className="space-y-3">
                      <p className="text-xl font-semibold min-h-[40px] flex items-center justify-center">
                        {isDragActive ? 'Drop the file here' : placeHolder}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center space-y-6">
                {/* File Icon and Name - Centered */}
                <div className="flex flex-col items-center space-y-4 text-center">
                  {getFileIcon(fileName || file?.name, file?.type)}
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {fileName || file?.name}
                    </p>
                    {file && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Section */}
                {!isNoProg && (file || fileSrc) && uploadStatus !== 'idle' && (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {getStatusMessage()}
                      </span>
                      <span className="text-sm font-medium">{currentProgress}%</span>
                    </div>
                    <Progress value={currentProgress} className={`w-full h-2 ${getProgressColor()}`} />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* Note at bottom left */}
        {Note && (
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground text-left">
            {Note}
          </div>
        )}
      </Card>

      {/* Upload status message */}
      {file && uploadStatus === 'failed' && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg text-red-800">
          <p className="font-medium">File upload failed!</p>
        </div>
      )}

      {file && uploadStatus === 'success' && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg text-green-800">
          <p className="font-medium">File uploaded successfully!</p>
        </div>
      )}
    </div>
  )
}

export { FileUpload }
export default FileUpload

//How to use
{/* <FileUpload
  // Required callback when file is selected
  onFileUpload={(file: File) => {
    console.log('File selected:', file.name);
    // Handle file upload logic here
  }}

  // Optional callbacks
  onFileRemove={() => {
    console.log('File removed');
    // Clean up any state related to the file
  }}

  onSampleDownload={() => {
    console.log('Download sample clicked');
    // Handle sample file download logic
  }}

  // File state parameters
  file={selectedFile} // File object (from useState<File | null>(null))
  fileSrc="https://example.com/preview-file.pdf" // URL for file preview (optional)
  fileName="custom-filename.xlsx" // Custom display name (optional, defaults to file.name)

  // Upload status parameters
  isUploading={isUploading} // Boolean to indicate upload in progress
  fileUploadStatus={uploadStatus} // 'S', 's', 'F', 'f' for success/failure signals
  uploadProgress={50} // Manual progress control (optional, component has built-in animation)

  // Configuration parameters
  isSample={true} // Show download sample button
  accept=".xlsx, .csv, .pdf" // Accepted file extensions
  maxSize={10 * 1024 * 1024} // 10MB max file size
  isNoProg={false} // Set to true to hide progress bar
  disabled={false} // Disable the dropzone

  // Content customization
  label="Upload Financial Report"
  description="Drag & drop your financial report here or click to browse"
  placeHolder="Upload Financial Document"

  // Custom note/content
  Note={
    <div className="text-left">
      <p><strong>Requirements:</strong></p>
      <ul className="list-disc list-inside text-xs mt-1 space-y-1">
        <li>Maximum file size: 10MB</li>
        <li>Supported formats: Excel, CSV, PDF</li>
        <li>Ensure data follows the sample format</li>
      </ul>
    </div>
  }

  // Custom children (replaces default upload icon and text)
  children={
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <FileText className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <p className="font-semibold text-lg">Custom Upload Area</p>
        <p className="text-sm text-muted-foreground mt-1">
          Click or drag files to this area to upload
        </p>
      </div>
    </div>
  }

  // Styling parameters
  height="400px"
  width="100%"
  alignicon={true}
  className="my-4 shadow-lg"
/> */}