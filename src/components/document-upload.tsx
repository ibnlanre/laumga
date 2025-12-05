import { Group, Text } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE, MS_WORD_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { FileText, X, Check } from "lucide-react";
import { useState } from "react";

interface DocumentUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  maxSize?: number;
  label?: string;
  accept?: string[];
}

export function DocumentUpload({
  value,
  onChange,
  maxSize = 10 * 1024 * 1024, // 10MB default for documents
  label = "Upload Document",
  accept = [...PDF_MIME_TYPE, ...MS_WORD_MIME_TYPE],
}: DocumentUploadProps) {
  const [fileName, setFileName] = useState<string | undefined>(
    value ? value.split("/").pop() : undefined
  );

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
      notifications.show({
        title: "Success",
        message: "Document uploaded successfully",
        color: "green",
      });
    }
  };

  const handleReject = () => {
    notifications.show({
      title: "Error",
      message: `File must be a PDF or Word document and less than ${maxSize / 1024 / 1024}MB`,
      color: "red",
    });
  };

  return (
    <div className="w-full">
      <Text size="sm" fw={500} mb="xs">
        {label}
      </Text>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={maxSize}
        accept={accept}
        className="border-2 border-dashed border-gray-300 transition-colors hover:border-institutional-green"
      >
        <Group
          justify="center"
          gap="xl"
          mih={80}
          style={{ pointerEvents: "none" }}
        >
          {fileName ? (
            <Group gap="md">
              <FileText className="h-8 w-8 text-institutional-green" />
              <div>
                <Text size="sm" fw={500}>
                  {fileName}
                </Text>
                <Text size="xs" c="dimmed">
                  Click to replace
                </Text>
              </div>
            </Group>
          ) : (
            <>
              <Dropzone.Idle>
                <FileText className="h-8 w-8 text-gray-400" />
              </Dropzone.Idle>

              <div>
                <Text size="lg" inline>
                  Drag document here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  PDF, DOC, or DOCX • Max {maxSize / 1024 / 1024}MB
                </Text>
              </div>
            </>
          )}

          <Dropzone.Accept>
            <Check className="h-8 w-8 text-green-500" />
          </Dropzone.Accept>

          <Dropzone.Reject>
            <X className="h-8 w-8 text-red-500" />
          </Dropzone.Reject>
        </Group>
      </Dropzone>
    </div>
  );
}
