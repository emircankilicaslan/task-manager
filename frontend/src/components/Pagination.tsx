'use client';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        ‹ Önceki
      </button>

      <span className="text-sm text-gray-600">
        {currentPage} / {lastPage}
      </span>

      <button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        Sonraki ›
      </button>
    </div>
  );
}
