import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS = ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"];

// =====================================================
// FORMAT DATE
// =====================================================
const formatDisplayDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day} / ${month} / ${year}`;
};

// =====================================================
// PARSE DATE
// =====================================================
const parseDate = (date) => {
  if (!date) return null;

  const [year, month, day] = date.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
};

// =====================================================
// FORMAT TO YYYY-MM-DD
// =====================================================
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// DATE RANGE PICKER
// =====================================================
export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const [selecting, setSelecting] = useState("start");

  const [currentMonth, setCurrentMonth] = useState(
    new Date(2026, 7, 1)
  );

  const containerRef = useRef(null);

  // ===================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ===================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ===================================================
  // OPEN CALENDAR
  // ===================================================
  const handleOpen = (type) => {
    setSelecting(type);
    setOpen(true);

    const selectedDate =
      type === "start"
        ? startDate
        : endDate;

    if (selectedDate) {
      const date = parseDate(selectedDate);

      setCurrentMonth(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        )
      );
    }
  };

  // ===================================================
  // PREVIOUS MONTH
  // ===================================================
  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  // ===================================================
  // NEXT MONTH
  // ===================================================
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  // ===================================================
  // SELECT DATE
  // ===================================================
  const handleSelectDate = (date) => {
    const selectedDate = formatDate(date);

    // -----------------------------------------------
    // SELECT START
    // -----------------------------------------------
    if (selecting === "start") {
      onChange(selectedDate, "");

      setSelecting("end");

      return;
    }

    // -----------------------------------------------
    // SELECT END
    // -----------------------------------------------
    if (selecting === "end") {
      // Kalau tanggal akhir lebih kecil
      // dari tanggal awal, jadikan sebagai
      // tanggal awal baru
      if (
        startDate &&
        selectedDate < startDate
      ) {
        onChange(
          selectedDate,
          startDate
        );

        setOpen(false);
        setSelecting("start");

        return;
      }

      onChange(
        startDate,
        selectedDate
      );

      setOpen(false);
      setSelecting("start");
    }
  };

  // ===================================================
  // CLEAR
  // ===================================================
  const handleClear = (event) => {
    event.stopPropagation();

    onChange("", "");

    setSelecting("start");
  };

  // ===================================================
  // CALENDAR GENERATION
  // ===================================================
  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  // Empty days before first date
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      new Date(year, month, day)
    );
  }

  // ===================================================
  // DATE STATE
  // ===================================================
  const selectedStart =
    parseDate(startDate);

  const selectedEnd =
    parseDate(endDate);

  // ===================================================
  // CHECK TODAY
  // ===================================================
  const today = new Date();

  const isToday = (date) => {
    if (!date) return false;

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  };

  // ===================================================
  // CHECK SELECTED
  // ===================================================
  const isStartDate = (date) => {
    if (!date || !selectedStart) {
      return false;
    }

    return (
      date.getTime() ===
      selectedStart.getTime()
    );
  };

  const isEndDate = (date) => {
    if (!date || !selectedEnd) {
      return false;
    }

    return (
      date.getTime() ===
      selectedEnd.getTime()
    );
  };

  // ===================================================
  // CHECK IN RANGE
  // ===================================================
  const isInRange = (date) => {
    if (
      !date ||
      !selectedStart ||
      !selectedEnd
    ) {
      return false;
    }

    return (
      date > selectedStart &&
      date < selectedEnd
    );
  };

  return (
    <div
      ref={containerRef}
      className="
        relative
        flex
        flex-col
        gap-3
        md:flex-row
        md:items-end
      "
    >

      {/* =================================================
          START DATE
      ================================================= */}
      <div className="flex-1">

        <p className="mb-1.5 ml-1 text-xs font-medium text-[#8D8A83]">
          Tanggal Mulai
        </p>

        <button
          type="button"
          onClick={() =>
            handleOpen("start")
          }
          className="
            flex
            h-[46px]
            w-full
            items-center
            justify-between
            rounded-xl
            border
            border-[#E7E1D5]
            bg-[#FFFCF4]
            px-4
            text-left
            shadow-sm
            transition
            hover:border-[#CFC8BA]
            focus:border-[#9B958A]
            focus:outline-none
            focus:ring-2
            focus:ring-[#E7E1D5]
          "
        >

          <span
            className={
              startDate
                ? "text-sm font-medium text-[#4A4742]"
                : "text-sm text-[#AAA59D]"
            }
          >
            {startDate
              ? formatDisplayDate(
                  startDate
                )
              : "DD / MM / YYYY"}
          </span>

          <CalendarDays
            size={17}
            strokeWidth={1.6}
            className="text-[#8D8A83]"
          />

        </button>

      </div>


      {/* =================================================
          SEPARATOR
      ================================================= */}
      <div className="hidden pb-3 text-[#AAA59D] md:block">
        —
      </div>


      {/* =================================================
          END DATE
      ================================================= */}
      <div className="flex-1">

        <p className="mb-1.5 ml-1 text-xs font-medium text-[#8D8A83]">
          Tanggal Selesai
        </p>

        <button
          type="button"
          onClick={() =>
            handleOpen("end")
          }
          className="
            flex
            h-[46px]
            w-full
            items-center
            justify-between
            rounded-xl
            border
            border-[#E7E1D5]
            bg-[#FFFCF4]
            px-4
            text-left
            shadow-sm
            transition
            hover:border-[#CFC8BA]
            focus:border-[#9B958A]
            focus:outline-none
            focus:ring-2
            focus:ring-[#E7E1D5]
          "
        >

          <span
            className={
              endDate
                ? "text-sm font-medium text-[#4A4742]"
                : "text-sm text-[#AAA59D]"
            }
          >
            {endDate
              ? formatDisplayDate(
                  endDate
                )
              : "DD / MM / YYYY"}
          </span>

          <CalendarDays
            size={17}
            strokeWidth={1.6}
            className="text-[#8D8A83]"
          />

        </button>

      </div>


      {/* =================================================
          CLEAR BUTTON
      ================================================= */}
      {(startDate || endDate) && (
        <button
          type="button"
          onClick={handleClear}
          className="
            flex
            h-[32px]
            w-[32px]
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[#9B9891]
            transition
            hover:bg-[#EDE9E0]
            hover:text-[#292825]
            md:mb-[7px]
          "
          title="Hapus tanggal"
        >
          <X size={16} />
        </button>
      )}


      {/* =================================================
          CUSTOM CALENDAR
      ================================================= */}
      {open && (
        <div
          className="
            absolute
            left-0
            top-[78px]
            z-50
            w-[320px]
            rounded-2xl
            border
            border-[#E7E1D5]
            bg-[#FFFCF4]
            p-4
            shadow-[0_12px_30px_rgba(39,38,36,0.12)]
          "
        >

          {/* =================================================
              CALENDAR HEADER
          ================================================= */}
          <div className="mb-4 flex items-center justify-between">

            <button
              type="button"
              onClick={
                handlePreviousMonth
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#6F6B65]
                transition
                hover:bg-[#EDE9E0]
              "
            >
              <ChevronLeft size={17} />
            </button>


            <p className="text-sm font-bold text-[#302E2B]">
              {MONTHS[month]} {year}
            </p>


            <button
              type="button"
              onClick={
                handleNextMonth
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#6F6B65]
                transition
                hover:bg-[#EDE9E0]
              "
            >
              <ChevronRight size={17} />
            </button>

          </div>


          {/* =================================================
              DAY HEADER
          ================================================= */}
          <div className="mb-2 grid grid-cols-7">

            {DAYS.map((day) => (
              <div
                key={day}
                className="
                  flex
                  h-8
                  items-center
                  justify-center
                  text-[11px]
                  font-semibold
                  text-[#AAA59D]
                "
              >
                {day}
              </div>
            ))}

          </div>


          {/* =================================================
              CALENDAR DAYS
          ================================================= */}
          <div className="grid grid-cols-7 gap-y-1">

            {calendarDays.map(
              (date, index) => {

                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-9"
                    />
                  );
                }

                const start =
                  isStartDate(date);

                const end =
                  isEndDate(date);

                const inRange =
                  isInRange(date);

                const todayDate =
                  isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() =>
                      handleSelectDate(
                        date
                      )
                    }
                    className={`
                      relative
                      flex
                      h-9
                      items-center
                      justify-center
                      text-xs
                      transition

                      ${
                        inRange
                          ? "bg-[#E9E5DC] text-[#4A4742]"
                          : ""
                      }

                      ${
                        start || end
                          ? "z-10"
                          : ""
                      }

                      ${
                        start || end
                          ? "text-white"
                          : ""
                      }

                      ${
                        !start &&
                        !end &&
                        !inRange
                          ? "text-[#4A4742] hover:bg-[#EDE9E0]"
                          : ""
                      }

                      ${
                        todayDate &&
                        !start &&
                        !end
                          ? "font-bold underline underline-offset-2"
                          : ""
                      }
                    `}
                  >

                    {/* SELECTED CIRCLE */}
                    {(start || end) && (
                      <span
                        className="
                          absolute
                          inset-1
                          -z-10
                          rounded-full
                          bg-[#272624]
                        "
                      />
                    )}

                    {date.getDate()}

                  </button>
                );
              }
            )}

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}
          <div
            className="
              mt-4
              border-t
              border-[#EDE8DF]
              pt-3
              text-center
              text-[11px]
              text-[#9B9891]
            "
          >
            {selecting === "start"
              ? "Pilih tanggal mulai"
              : "Pilih tanggal selesai"}
          </div>

        </div>
      )}

    </div>
  );
}