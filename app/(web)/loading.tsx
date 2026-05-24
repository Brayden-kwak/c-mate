import { SkeletonCard } from "@/app/_components/ui/Skeleton";

export default function WebLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 xl:p-0 xl:pt-6">
      <SkeletonCard rows={4} />
      <SkeletonCard rows={3} />
    </div>
  );
}
