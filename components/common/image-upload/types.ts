export interface ImageUploadProps {
  bucket: string;
  folder?: string;

  value: string | string[];
  onChange: (value: string | string[]) => void;

  multiple?: boolean;
  maxFiles?: number;

  aspect?: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}
