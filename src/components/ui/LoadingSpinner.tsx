export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="relative">
        <div className="w-12 h-12 border-t-2 border-b-2 border-[#6366F1] rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-r-2 border-l-2 border-[#6366F1] rounded-full animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', opacity: 0.7 }}></div>
      </div>
    </div>
  );
} 