"use client";
import React, { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { FaCalendar } from "react-icons/fa";

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (event: { target: { name?: string; value: string } }) => void; // Adjusted for flatpickr
}

const DatePicker: React.FC<DatePickerProps> = ({ id, name, className, value, onChange }) => {
  const flatpickrRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const options = {
      dateFormat: 'Y-m-d',
      defaultDate: value || new Date().toISOString().split('T')[0], // Default to current date
      onChange: (selectedDates: Date[], dateStr: string) => {
        if (onChange) {
          onChange({ target: { name, value: dateStr } }); // Pass selected date to parent
        }
      },
    };

    // Initialize flatpickr on the input element
    if (flatpickrRef.current) {
      flatpickr(flatpickrRef.current, options);
    }
  }, [value, name, onChange]);

  return (
    <div className="relative flex items-center">
      <div className='absolute left-2'>
        <FaCalendar />
      </div>
      <input
        id={id}
        name={name}
        type="text" // Set to "text" since flatpickr controls the value
        ref={flatpickrRef}
        className='rounded-md grow text-[15px] border-[1px] border-[#bcbcbc] border-solid h-[40px] outline-none py-[0] px-[30px]'
        readOnly // Prevent manual editing as flatpickr handles the input
      />
    </div>
  );
};

export default DatePicker;