import { apiFetch } from "@/app/_lib/api";

type PresignResponse = {
  uploads: Array<{ uploadUrl: string; key: string }>;
};

const getUploadContentType = (file: File): string => {
  if (file.type) return file.type;

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  return "image/jpeg";
};

export const presignAndUpload = async (file: File): Promise<string> => {
  const contentType = getUploadContentType(file);
  const result = await apiFetch<PresignResponse>(
    "/api/profile/photos/presign",
    {
      method: "POST",
      body: JSON.stringify({ count: 1, contentTypes: [contentType] }),
    },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  const upload = result.data.uploads[0];
  if (!upload) throw new Error("파일 업로드 정보를 받지 못했습니다.");

  const uploadRes = await fetch(upload.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  return upload.key;
};
