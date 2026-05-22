import type { Metadata } from "next";
import { Stepper } from "@/app/_components/web-shell/Stepper";
import { BaseInfoForm } from "@/app/_components/form/BaseInfoForm";

export const metadata: Metadata = {
  title: "기본정보 | cmate",
};

export default function BaseInfoPage() {
  return (
    <div
      className="xl:relative xl:w-full xl:overflow-visible xl:rounded-lg xl:border xl:border-border xl:bg-page xl:shadow-md"
      data-cmate-frame
    >
      <div className="hidden xl:block mx-0">
        <Stepper />
      </div>

      <div className="xl:px-8 xl:pb-0">
        <div className="max-w-form-content-width xl:mx-auto">
          <BaseInfoForm />
        </div>
      </div>
    </div>
  );
}
