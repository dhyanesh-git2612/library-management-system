import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";

const ROW_LABELS: Record<string, string> = {
  A: "Fiction Wing",
  B: "Science & Tech",
  C: "History & Biography",
  D: "Arts & Literature",
  E: "Children's Section",
  F: "Reference Section",
  G: "Periodicals",
  H: "Special Collections"
};



export default function MapView() {
  const { locations, getBooksByLocation, books } = useBooks();
  const [searchParams] = useSearchParams();
  const highlightedBlock = searchParams.get("block");

  const [selectedBlock, setSelectedBlock] = useState<string | null>(highlightedBlock);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const selectedBooks = useMemo(
    () => selectedBlock ? getBooksByLocation(selectedBlock) : [],
    [selectedBlock, getBooksByLocation]
  );

  const maxBooks = useMemo(
    () => Math.max(...locations.map(l => l.bookCount), 1),
    [locations]
  );

  const getHeatColor = (count: number, row: string) => {
    const intensity = count / maxBooks;
    const baseColors: Record<string, [number, number, number]> = {
      A: [59, 130, 246], B: [6, 182, 212], C: [217, 119, 6], D: [168, 85, 247],
      E: [236, 72, 153], F: [107, 114, 128], G: [20, 184, 166], H: [225, 29, 72]
    };
    const [r, g, b] = baseColors[row] || [100, 100, 100];
    const alpha = 0.3 + intensity * 0.7;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🗺️ Library Floor Map</h1>
        <p className="text-gray-500 mt-1">Interactive satellite-style view — click a block to see its books</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
            {/* Column headers */}
            <div className="flex items-center mb-2 ml-20">
              {cols.map(c => (
                <div key={c} className="flex-1 text-center text-xs font-bold text-gray-400">
                  Aisle {c}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {rows.map(row => {
              const rowLocs = locations.filter(l => l.blockId.startsWith(row));
              const rowBookCount = rowLocs.reduce((sum, l) => sum + l.bookCount, 0);

              return (
                <div key={row} className="flex items-center mb-2">
                  {/* Row label */}
                  <div className="w-20 shrink-0 text-right pr-3">
                    <p className="text-xs font-bold text-gray-600">Row {row}</p>
                    <p className="text-[9px] text-gray-400 leading-tight">{ROW_LABELS[row]}</p>
                    <p className="text-[9px] text-amber-600 font-semibold">{rowBookCount} books</p>
                  </div>

                  {/* Blocks */}
                  <div className="flex-1 grid grid-cols-8 gap-1.5">
                    {cols.map(col => {
                      const blockId = `${row}${col}`;
                      const loc = locations.find(l => l.blockId === blockId);
                      const count = loc?.bookCount || 0;
                      const isSelected = selectedBlock === blockId;
                      const isHighlighted = highlightedBlock === blockId;
                      const isHovered = hoveredBlock === blockId;

                      return (
                        <button
                          key={blockId}
                          onClick={() => setSelectedBlock(isSelected ? null : blockId)}
                          onMouseEnter={() => setHoveredBlock(blockId)}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className={`relative aspect-square rounded-lg transition-all duration-200 border-2 flex flex-col items-center justify-center cursor-pointer group ${
                            isSelected
                              ? "border-amber-400 ring-4 ring-amber-200 scale-105 z-10 shadow-lg"
                              : isHighlighted
                              ? "border-amber-400 ring-2 ring-amber-200 shadow-md"
                              : "border-white/50 hover:border-gray-300 hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: getHeatColor(count, row),
                            boxShadow: isHovered && !isSelected ? "0 4px 15px rgba(0,0,0,0.2)" : undefined
                          }}
                          title={`${ROW_LABELS[row]} — Aisle ${col}: ${count} books`}
                        >
                          <span className="text-[10px] font-bold text-white drop-shadow-md">{blockId}</span>
                          <span className="text-[8px] text-white/80 drop-shadow-md">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              {rows.map(row => (
                <div key={row} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-gray-400 to-gray-500" 
                    style={{ background: getHeatColor(0.5 * maxBooks, row) }} />
                  <span className="text-[10px] text-gray-500">{ROW_LABELS[row]}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Block color intensity = number of books stored. Click any block to see its books.
            </p>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1">
          {selectedBlock ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 border border-amber-100 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Block {selectedBlock}</h2>
                  <p className="text-xs text-gray-500">
                    {locations.find(l => l.blockId === selectedBlock)?.label}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 mb-4">
                <p className="text-sm font-semibold text-amber-800">
                  {selectedBooks.length} book{selectedBooks.length !== 1 ? "s" : ""} in this section
                </p>
                <p className="text-xs text-amber-600">
                  {selectedBooks.filter(b => b.status === "available").length} available • {selectedBooks.filter(b => b.status === "checked-out").length} checked out
                </p>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {selectedBooks.map(book => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="block p-3 bg-gray-50 hover:bg-amber-50 rounded-xl transition-all border border-gray-100 hover:border-amber-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        book.status === "available"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {book.status === "available" ? "✓" : "⊗"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-400">{book.genre}</span>
                      <span className="text-[10px] text-gray-400">Qty: {book.quantity}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 text-center">
              <span className="text-5xl block mb-4">👆</span>
              <h3 className="font-bold text-gray-700 mb-2">Select a Block</h3>
              <p className="text-sm text-gray-500">Click any block on the map to see the books stored in that section.</p>

              <div className="mt-6 text-left">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  {rows.map(row => {
                    const count = books.filter(b => b.locationBlock.startsWith(row)).length;
                    return (
                      <div key={row} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{ROW_LABELS[row]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                              style={{ width: `${(count / books.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-gray-500 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
