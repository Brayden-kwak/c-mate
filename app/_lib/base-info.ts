export type EduRow = {
  id: number;
  degree: string;
  school: string;
  major: string;
};

export type FamilySectionData = {
  marriageExp: string;
  region: string;
  address: string;
  addressDetail: string;
};

export type FaithSectionData = {
  church: string;
  denom: string;
  pastor: string;
  churchAddr: string;
  nativeFaith: string;
};

export type EducationSectionData = {
  education: string;
  eduRows: EduRow[];
  job: string;
  workplace: string;
  salary: string;
  salaryHidden: boolean;
};

export type AppearanceSectionData = {
  height: string;
  bloodType: string;
  bodyType: string;
  styles: string[];
};

export type LifestyleSectionData = {
  drinking: string;
  smoking: string;
  childrenPlan: string;
};

export type PhotoItemData = {
  key: string;
  url?: string;
  description?: string;
};

export type PhotoSectionData = {
  photos: PhotoItemData[];
  pbPhotos: PhotoItemData[];
};

export type BaseInfoPayload = {
  family?: FamilySectionData;
  faith?: FaithSectionData;
  education?: EducationSectionData;
  appearance?: AppearanceSectionData;
  lifestyle?: LifestyleSectionData;
  photos?: PhotoSectionData;
};
