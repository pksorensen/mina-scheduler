"use client";

import React from "react";

export interface Booking {
  start: string | Date;
  end: string | Date;
  user?: string;
  color?: string;
}

export interface CarSchedule {
  carId: string;
  name: string;
  bookings: Booking[];
}

interface CarScheduleTimelineProps {
  data: CarSchedule[];
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function CarScheduleTimeline({ data }: CarScheduleTimelineProps) {
  const formatHour = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  const getOffsetPercent = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes();
    return (minutes / (24 * 60)) * 100;
  };

  const getWidthPercent = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 60000; // minutes
    return (diff / (24 * 60)) * 100;
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[150px_repeat(24,1fr)] sticky top-0 z-10 bg-background border-b text-xs">
          <div className="px-2 py-1 font-medium border-r bg-background">Car</div>
          {hours.map((h) => (
            <div key={h} className="text-center border-r px-2 py-1">
              {formatHour(h)}
            </div>
          ))}
        </div>
        {data.map((car) => (
          <div
            key={car.carId}
            className="relative grid grid-cols-[150px_repeat(24,1fr)] border-b h-12 text-sm"
          >
            <div className="px-2 py-1 font-medium border-r bg-background sticky left-0 z-10">
              {car.name}
            </div>
            {hours.map((h) => (
              <div key={h} className="border-r" />
            ))}
            {car.bookings.map((bk, idx) => {
              const start = new Date(bk.start);
              const end = new Date(bk.end);
              const left = getOffsetPercent(start);
              const width = getWidthPercent(start, end);
              const color = bk.color || "bg-blue-500";
              return (
                <div
                  key={idx}
                  title={`${bk.user || ""} \n${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}
                  className={`absolute top-1 text-white text-xs rounded ${color}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <div className="px-2 truncate">{bk.user}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}


