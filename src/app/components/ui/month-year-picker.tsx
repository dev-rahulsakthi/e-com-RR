import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthYearPickerProps {
  placeholder?: string;
  value: { month: number; year: number } | null;
  onChange: (value: { month: number; year: number }) => void;
  minDate?: { month: number; year: number }; // for "To" picker validation
  maxDate?: { month: number; year: number };
}

export default function MonthYearPicker({
  placeholder,
  value,
  onChange,
  minDate,
  maxDate,
}: MonthYearPickerProps) {
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-56" ref={ref}>
      <div
        className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <span className={`text-sm ${value ? "text-black" : "text-gray-400"}`}>
          {value ? `${months[value.month]} ${value.year}` : placeholder}
        </span>
        <Calendar size={18} className="text-gray-500" />
      </div>

      {show && (
        <div className=" z-50 mt-2 bg-white border rounded shadow-lg p-2 w-full max-h-[300px] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setYear((y) => y - 1)}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">{year}</span>
            <button onClick={() => setYear((y) => y + 1)}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((monthName, index) => {
              const isSelected = value?.month === index && value?.year === year;

              const selectedDate = new Date(`${monthName} 1, ${year}`);
              const min = minDate
                ? new Date(`${months[minDate.month]} 1, ${minDate.year}`)
                : false;
              const max = maxDate
                ? new Date(`${months[maxDate.month]} 1, ${maxDate.year}`)
                : false;

              const isBeforeMin = min && selectedDate < min;
              const isAfterMax = max && selectedDate > max;
              const isDisabled = isBeforeMin || isAfterMax;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isDisabled) {
                      onChange({ month: index, year });
                      setShow(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`text-sm rounded px-3 py-2 transition ${
                    isSelected ? "bg-blue-500 text-white" : ""
                  }
                                    ${
                                      isDisabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-blue-100"
                                    }`}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
