import PencilLoader from "@/components/shared/PencilLoader";

export default function Loading() {
  return (
    <div className="main-page flex items-center justify-center h-full min-h-[50vh]">
      <PencilLoader width="60px" height="60px" />
    </div>
  );
}
