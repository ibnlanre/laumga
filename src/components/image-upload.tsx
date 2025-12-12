import { Avatar, Group, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { Upload, X, Check } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  maxSize?: number;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024,
  label = "Upload Photo",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
      notifications.show({
        title: "Success",
        message: "Photo uploaded successfully",
        color: "green",
      });
    }
  };

  const handleReject = () => {
    notifications.show({
      title: "Error",
      message: `File must be an image and less than ${maxSize / 1024 / 1024}MB`,
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
        accept={IMAGE_MIME_TYPE}
        className="border-2 border-dashed border-gray-300 transition-colors hover:border-institutional-green"
      >
        <Group
          justify="center"
          gap="xl"
          mih={120}
          style={{ pointerEvents: "none" }}
        >
          {preview ? (
            <Avatar src={preview} size={80} radius="xl" />
          ) : (
            <Dropzone.Idle>
              <Upload size={48} className="text-gray-400" />
            </Dropzone.Idle>
          )}

          <div>
            <Text size="xl" inline>
              {preview ? "Change photo" : "Drag photo here or click to select"}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              File should not exceed {maxSize / 1024 / 1024}MB
            </Text>
          </div>

          <Dropzone.Accept>
            <Check size={48} className="text-green-500" />
          </Dropzone.Accept>

          <Dropzone.Reject>
            <X size={48} className="text-red-500" />
          </Dropzone.Reject>
        </Group>
      </Dropzone>
    </div>
  );
}
