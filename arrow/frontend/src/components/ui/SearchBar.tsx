import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UISearchBarProps<T = any> {
  placeholder?: string;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
  data?: Array<T & { id?: string; title?: string; description?: string }>;
  onResultClick?: (item: T) => void;
  className?: string;
}

const SearchBar: React.FC<UISearchBarProps> = ({
  placeholder = 'Rechercher...',
  fullWidth = true,
  loading = false,
  onSearch,
  data = [],
  onResultClick,
  className = ''
}) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<typeof data>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (onSearch) onSearch(next);
    if (!next) {
      setResults([]);
      setOpen(false);
      return;
    }
    const lower = next.toLowerCase();
    const filtered = data.filter((d: any) => (
      (d.title && String(d.title).toLowerCase().includes(lower)) ||
      (d.description && String(d.description).toLowerCase().includes(lower))
    ));
    setResults(filtered.slice(0, 6));
    setOpen(filtered.length > 0);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className="relative group">
        {/* Background + border gradient */}
        <div 
          className="absolute -inset-[2px] rounded-xl opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff)'
          }}
        />
        <div 
          className="relative rounded-xl overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            boxShadow: '0 10px 30px rgba(61, 155, 255, 0.2)'
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(61, 155, 255, 0.06) 2px, transparent 4px)'
            }}
          />

          {/* Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#87ceeb] drop-shadow" />

          {/* Input */}
          <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full h-11 pl-10 pr-10 bg-transparent outline-none text-sm text-[#cfefff] placeholder-[#87ceeb]/70 tracking-wide"
            style={{ letterSpacing: '0.05em' }}
          />

          {/* Loading spinner */}
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#87ceeb]" />
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div 
          className="relative mt-2"
        >
          <div 
            className="absolute z-50 w-full rounded-xl border p-2"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              borderColor: 'rgba(61, 155, 255, 0.3)',
              boxShadow: '0 10px 30px rgba(61, 155, 255, 0.25)'
            }}
          >
            {results.map((r: any, idx: number) => (
              <div
                key={r.id ?? idx}
                onClick={() => {
                  setOpen(false);
                  setValue('');
                  if (onResultClick) onResultClick(r);
                }}
                className="px-3 py-3 rounded-lg transition-colors cursor-pointer"
                style={{
                  border: '1px solid rgba(61, 155, 255, 0.15)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(61, 155, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div 
                  className="text-sm font-semibold"
                  style={{ color: '#cfefff' }}
                >
                  {r.title ?? 'Résultat'}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: 'rgba(135, 206, 235, 0.8)' }}
                >
                  {r.description ?? ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;


