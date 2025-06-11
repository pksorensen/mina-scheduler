"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function CarScheduleTimeline({
  data,
}: CarScheduleTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Resource column multiplier (2x, 3x, 4x, etc. of time column width)
  const [resourceColumnMultiplier, setResourceColumnMultiplier] = useState(3);

  // Total columns = resource columns + 24 time columns
  const totalColumns = resourceColumnMultiplier + 24;

  // Show all 24 hours but allow horizontal scrolling
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  const getOffsetPercent = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes();
    return (minutes / (24 * 60)) * 100;
  };

  const getWidthPercent = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 60000; // minutes
    return (diff / (24 * 60)) * 100;
  };

  // Function to scroll to a specific hour
  const scrollToHour = (hour: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Hour columns start after resource columns
      const hourColumnIndex = resourceColumnMultiplier + hour;
      const scrollPosition = hourColumnIndex * columnWidth;

      console.log("=== SCROLL TO HOUR DEBUG ===");
      console.log("target hour:", hour);
      console.log("totalContentWidth:", totalContentWidth);
      console.log("totalColumns:", totalColumns);
      console.log("columnWidth:", columnWidth);
      console.log("resourceColumnMultiplier:", resourceColumnMultiplier);
      console.log("hourColumnIndex:", hourColumnIndex);
      console.log("calculated scrollPosition:", scrollPosition);
      console.log("============================");

      isScrollingRef.current = true;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  // Auto-scroll to 8:00 AM on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToHour(8);
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  // Navigation functions
  const scrollToPreviousHour = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Find current hour based on scroll position
      const currentColumnIndex = Math.round(currentScroll / columnWidth);
      const currentHour = Math.max(
        0,
        currentColumnIndex - resourceColumnMultiplier
      );
      const prevHour = Math.max(0, currentHour - 1);
      scrollToHour(prevHour);
    }
  };

  const scrollToNextHour = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Find current hour based on scroll position
      const currentColumnIndex = Math.round(currentScroll / columnWidth);
      const currentHour = Math.max(
        0,
        currentColumnIndex - resourceColumnMultiplier
      );
      const nextHour = Math.min(23, currentHour + 1);
      scrollToHour(nextHour);
    }
  };

  // Show a message if no data is provided
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-default-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No timeline data available
          </h3>
          <p className="text-sm text-muted-foreground">
            Add some resource scheduling data to see the timeline view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Resource Column Width Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Resource column width:
          </span>
          {[2, 3, 4, 5].map((multiplier) => (
            <Button
              key={multiplier}
              variant={
                resourceColumnMultiplier === multiplier ? "default" : "outline"
              }
              size="sm"
              onClick={() => setResourceColumnMultiplier(multiplier)}
              className="h-8"
            >
              {multiplier}x
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToPreviousHour}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Hour
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToNextHour}
            className="h-8"
          >
            Next Hour
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToHour(8)}
            className="h-8"
          >
            Go to 8:00 AM
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToHour(0)}
            className="h-8"
          >
            Go to Start
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto w-full relative"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="min-w-[1200px]">
          {/* Header */}
          <div
            className="grid sticky top-0 z-30 bg-background border-b"
            style={{
              gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
            }}
          >
            {/* Empty resource columns for grid structure */}
            {Array.from({ length: resourceColumnMultiplier }).map((_, i) => (
              <div key={`empty-header-${i}`} className="border-r h-10" />
            ))}

            {/* Hour columns with proper snap alignment */}
            {hours.map((h) => (
              <div
                key={h}
                className="text-center border-r px-1 py-2 h-10 flex items-center justify-center text-xs"
                style={{ scrollSnapAlign: "start" }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Sticky Resource Header - positioned absolutely to overlay */}
          <div
            className="absolute left-0 px-3 py-2 font-medium border-r bg-background z-40 h-10 flex items-center text-sm"
            style={{
              width: `${(resourceColumnMultiplier / totalColumns) * 100}%`,
              top: "0px",
              position: "sticky",
              left: "0px",
            }}
          >
            Resource
          </div>

          {data.map((car) => (
            <div
              key={car.carId}
              className="grid border-b h-12 text-sm hover:bg-default-50 transition-colors relative"
              style={{
                gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
              }}
            >
              {/* Empty resource columns for grid structure */}
              {Array.from({ length: resourceColumnMultiplier }).map((_, i) => (
                <div key={`empty-row-${i}`} className="border-r h-12" />
              ))}

              {/* Hour columns with proper snap alignment */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="border-r h-12 relative"
                  style={{ scrollSnapAlign: "start" }}
                />
              ))}

              {/* Sticky Resource Name - positioned absolutely to overlay */}
              <div
                className="absolute left-0 top-0 px-3 py-2 font-medium border-r bg-background flex items-center h-12 text-sm z-30"
                style={{
                  width: `${(resourceColumnMultiplier / totalColumns) * 100}%`,
                  position: "sticky",
                  left: "0px",
                }}
              >
                {car.name}
              </div>

              {/* Booking overlays */}
              {car.bookings.map((bk, idx) => {
                const start = new Date(bk.start);
                const end = new Date(bk.end);
                const left = getOffsetPercent(start);
                const width = getWidthPercent(start, end);
                const color = bk.color || "bg-blue-500";

                // Calculate left position accounting for resource columns
                const resourceColumnWidthPercent =
                  (resourceColumnMultiplier / totalColumns) * 100;
                const timelineWidthPercent = (24 / totalColumns) * 100;
                const leftPositionPercent =
                  resourceColumnWidthPercent +
                  (left * timelineWidthPercent) / 100;
                const widthPercent = (width * timelineWidthPercent) / 100;

                return (
                  <div
                    key={idx}
                    title={`${
                      bk.user || "Unknown"
                    } \n${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}
                    className={`absolute top-1 bottom-1 text-white text-xs rounded ${color} transition-opacity hover:opacity-80 cursor-pointer z-20`}
                    style={{
                      left: `${leftPositionPercent}%`,
                      width: `${widthPercent}%`,
                      minWidth: "20px",
                    }}
                  >
                    <div className="px-2 py-1 truncate h-full flex items-center">
                      {bk.user || "Unknown"}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
