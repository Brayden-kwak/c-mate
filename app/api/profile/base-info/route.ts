import type { NextRequest } from "next/server";
import type { BaseInfoPayload } from "@/app/_lib/base-info";

type JsonRecord = Record<string, unknown>;

let storedBaseInfo: BaseInfoPayload = {};

const SECTION_KEYS = [
  "family",
  "faith",
  "education",
  "appearance",
  "lifestyle",
  "photos",
] as const;

const isRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const hasOnlyKeys = (value: JsonRecord, keys: readonly string[]): boolean => {
  return Object.keys(value).every((key) => keys.includes(key));
};

const hasStringFields = (
  value: JsonRecord,
  keys: readonly string[],
): boolean => {
  return keys.every((key) => typeof value[key] === "string");
};

const isEduRow = (value: unknown): boolean => {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.degree === "string" &&
    typeof value.school === "string" &&
    typeof value.major === "string"
  );
};

const isPhotoItem = (value: unknown): boolean => {
  return (
    isRecord(value) &&
    typeof value.key === "string" &&
    (value.description === undefined || typeof value.description === "string")
  );
};

const isBaseInfoPayload = (value: unknown): value is BaseInfoPayload => {
  if (!isRecord(value) || !hasOnlyKeys(value, SECTION_KEYS)) return false;

  if (
    value.family !== undefined &&
    (!isRecord(value.family) ||
      !hasStringFields(value.family, [
        "marriageExp",
        "region",
        "address",
        "addressDetail",
      ]))
  ) {
    return false;
  }

  if (
    value.faith !== undefined &&
    (!isRecord(value.faith) ||
      !hasStringFields(value.faith, [
        "church",
        "denom",
        "pastor",
        "churchAddr",
        "nativeFaith",
      ]))
  ) {
    return false;
  }

  if (value.education !== undefined) {
    if (
      !isRecord(value.education) ||
      !hasStringFields(value.education, [
        "education",
        "job",
        "workplace",
        "salary",
      ]) ||
      typeof value.education.salaryHidden !== "boolean" ||
      !Array.isArray(value.education.eduRows) ||
      !value.education.eduRows.every(isEduRow)
    ) {
      return false;
    }
  }

  if (
    value.appearance !== undefined &&
    (!isRecord(value.appearance) ||
      !hasStringFields(value.appearance, ["height", "bloodType", "bodyType"]) ||
      !Array.isArray(value.appearance.styles) ||
      !value.appearance.styles.every((style) => typeof style === "string"))
  ) {
    return false;
  }

  if (
    value.lifestyle !== undefined &&
    (!isRecord(value.lifestyle) ||
      !hasStringFields(value.lifestyle, [
        "drinking",
        "smoking",
        "childrenPlan",
      ]))
  ) {
    return false;
  }

  if (
    value.photos !== undefined &&
    (!isRecord(value.photos) ||
      !Array.isArray(value.photos.photos) ||
      !Array.isArray(value.photos.pbPhotos) ||
      !value.photos.photos.every(isPhotoItem) ||
      !value.photos.pbPhotos.every(isPhotoItem))
  ) {
    return false;
  }

  return true;
};

export const GET = async (): Promise<Response> => {
  return Response.json(storedBaseInfo);
};

export const PATCH = async (request: NextRequest): Promise<Response> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!isBaseInfoPayload(body)) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  storedBaseInfo = structuredClone(body);
  return Response.json({ ok: true });
};
