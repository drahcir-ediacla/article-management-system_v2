"use client";
import React, { useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { FaCalendar } from "react-icons/fa";

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (event: { target: { name?: string; value: string } }) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, name, className, value, onChange }) => {
  const flatpickrRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
  const options = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i', // Display format for user
    defaultDate: value || new Date().toISOString(), // ISO format default
    onChange: (selectedDates: Date[]) => {
      if (onChange && selectedDates.length > 0) {
        const isoDate = selectedDates[0].toISOString(); // Convert to ISO format
        onChange({ target: { name, value: isoDate } });
      }
    },
  };

  if (flatpickrRef.current) {
    flatpickr(flatpickrRef.current, options);
  }
}, [value, name, onChange]);

  

  return (
    <div className="relative flex items-center">
      <div className="absolute left-2">
        <FaCalendar />
      </div>
      <input
        id={id}
        name={name}
        type="text"
        ref={flatpickrRef}
        className="rounded-md grow text-[15px] border-[1px] border-[#bcbcbc] border-solid h-[40px] outline-none py-[0] px-[30px]"
        readOnly
      />
    </div>
  );
};

export default DatePicker;
