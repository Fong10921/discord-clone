"use client";

import { UploadDropzone } from "@/lib/uploadThing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage" | "profileImage";
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          alt="Uploaded Image"
          src={value}
          fill
          className="rounded-full w-20 h-20"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 rounded-full text-white p-1 absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 rounded-full text-white p-1 absolute -top-2 -right-2 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        return onChange(res?.[0].url);
      }}
      className="text-white"
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};

export default FileUpload;
