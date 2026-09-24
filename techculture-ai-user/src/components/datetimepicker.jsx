import React, { useState, useRef, useEffect } from "react";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

const ModernDateTimePicker = ({ value, onChange, minDateTime, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("date");
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  // Initialize temp values from props
  useEffect(() => {
    if (value) {
      const [datePart, timePart] = value.split("T");
      setTempDate(datePart);
      setTempTime(timePart);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  // Generate calendar days - Fixed to avoid timezone issues
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Create dates using local timezone to avoid offset issues
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(year, month, 1 - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison

    // Get minimum date if provided
    let minDate = null;
    if (minDateTime) {
      minDate = new Date(minDateTime);
      minDate.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < 42; i++) {
      // Create date using year, month, day to avoid timezone issues
      const currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i
      );

      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.getTime() === today.getTime();

      // Format date as YYYY-MM-DD for comparison
      const dateString =
        currentDate.getFullYear() +
        "-" +
        String(currentDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDate.getDate()).padStart(2, "0");

      const isSelected = tempDate === dateString;
      const isDisabled = minDate && currentDate < minDate;

      days.push({
        date: currentDate,
        dateString: dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
      });
    }
    return days;
  };

  const handleDateSelect = (dayObj) => {
    setTempDate(dayObj.dateString);
    setActiveTab("time");
  };

  const handleTimeSelect = (time) => {
    setTempTime(time);
    if (tempDate) {
      const dateTimeString = `${tempDate}T${time}`;
      onChange({ target: { name: "demoDateTime", value: dateTimeString } });
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    if (tempDate && tempTime) {
      const dateTimeString = `${tempDate}T${tempTime}`;
      onChange({ target: { name: "demoDateTime", value: dateTimeString } });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempDate("");
    setTempTime("");
    onChange({ target: { name: "demoDateTime", value: "" } });
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (onFocus && !isOpen) {
      onFocus();
    }
  };

  const formatDisplayValue = () => {
    if (!value) return "";

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    // Create date using local timezone
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div
        onClick={handleInputClick}
        className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-gray-200 shadow-md focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-400 cursor-pointer hover:border-blue-400 transition-all duration-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <IoCalendarOutline className="text-blue-500 text-xl" />
          <span className={value ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"}>
            {value ? (
              <span className="text-black" style={{ color: '#000' }}>{formatDisplayValue()}</span>
            ) : (
              "Select preferred date & time"
            )}
          </span>
        </div>
        <IoChevronDown
          className={`text-blue-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow z-50 p-2 min-w-[400px]"
        >
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-100">
            <button
              className={`flex-1 py-2 text-lg font-semibold rounded-t-xl transition-colors duration-200 ${activeTab === 'date' ? 'bg-orange-50 text-orange-600' : 'bg-transparent text-gray-500'}`}
              onClick={() => setActiveTab('date')}
            >
              <IoCalendarOutline className="inline mr-2" /> Date
            </button>
            <button
              className={`flex-1 py-2 text-lg font-semibold rounded-t-xl transition-colors duration-200 ${activeTab === 'time' ? 'bg-orange-50 text-orange-600' : 'bg-transparent text-gray-500'}`}
              onClick={() => setActiveTab('time')}
            >
              <IoTimeOutline className="inline mr-2" /> Time
            </button>
          </div>

          {/* Date Picker */}
          {activeTab === 'date' && (
            <div className="mb-6">
              {/* Month and Year Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="brand-cta-outline p-2 rounded-full border"
                >
                  <IoChevronBack />
                </button>
                <span className="text-lg font-semibold text-black">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="brand-cta-outline p-2 rounded-full border"
                >
                  <IoChevronForward />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-gray-500 font-medium mb-2">
                {weekDays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((dayObj, idx) => (
                  <button
                    key={idx}
                    disabled={dayObj.isDisabled}
                    onClick={() => handleDateSelect(dayObj)}
                    className={`w-10 h-10 rounded-full text-base font-semibold transition-colors duration-200
                      ${dayObj.isSelected ? 'bg-[#FE602F] text-white shadow-lg' : ''}
                      ${dayObj.isToday ? 'border-2 border-blue-400' : ''}
                      ${!dayObj.isCurrentMonth ? 'text-gray-300' : 'text-black'}
                      ${dayObj.isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}
                    `}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Picker */}
          {activeTab === 'time' && (
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-3">
                {generateTimeOptions().map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={false}
                    className={`py-2 px-4 rounded-full font-medium transition-colors duration-200
                      ${tempTime === time ? 'bg-[#FE602F] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-700'}
                      ${false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="brand-cta-outline px-5 py-2 rounded-lg border font-semibold transition-colors duration-200"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="brand-cta-gradient px-5 py-2 rounded-lg text-white font-semibold shadow transition-colors duration-200"
              onClick={handleApply}
              disabled={!(tempDate && tempTime)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDateTimePicker;
