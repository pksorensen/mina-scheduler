"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

const DEFAULT_MIN_WITH = 400; // Default minimum width for the timeline
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartMultiplierRef = useRef(0);

  // Resource column multiplier (2x, 3x, 4x, etc. of time column width)
  const [resourceColumnMultiplier, setResourceColumnMultiplier] = useState(2);
  const [zoom, setZoom] = useState(1);

  const [interval, setInterval] = useState<
    "hour" | "half-hour" | "quarter-hour"
  >("hour"); // Define the interval for time slots

  // Calculate number of time slots based on interval
  const getTimeSlotCount = () => {
    switch (interval) {
      case "quarter-hour":
        return 24 * 4; // 15-minute intervals
      case "half-hour":
        return 24 * 2; // 30-minute intervals
      case "hour":
      default:
        return 24; // 60-minute intervals
    }
  };

  const timeSlotCount = getTimeSlotCount();
  
  // Total columns = resource columns + time columns
  const totalColumns = resourceColumnMultiplier + timeSlotCount;

  // Generate time slots based on interval
  const getTimeSlots = () => {
    const slots = [];
    const minutesPerSlot = interval === "quarter-hour" ? 15 : interval === "half-hour" ? 30 : 60;
    const slotsPerHour = 60 / minutesPerSlot;
    
    for (let hour = 0; hour < 24; hour++) {
      for (let slot = 0; slot < slotsPerHour; slot++) {
        const minutes = slot * minutesPerSlot;
        slots.push({ hour, minutes, totalMinutes: hour * 60 + minutes });
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const formatTime = (hour: number, minutes: number = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const getOffsetPercent = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes();
    return (minutes / (24 * 60)) * 100;
  };

  const getWidthPercent = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 60000; // minutes
    return (diff / (24 * 60)) * 100;
  };
  const minColumnWidth = 50;
  const [columnWidth, setcolumnWidth] = useState(
    ((containerRef.current?.scrollWidth ?? DEFAULT_MIN_WITH) / totalColumns) * 3
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth =
          (containerRef.current.scrollWidth * zoom) / totalColumns;

        console.log("=== RESIZE DEBUG ===");
        console.log(
          "containerRef.current.scrollWidth:",
          containerRef.current.scrollWidth
        );
        console.log("totalColumns:", totalColumns);
        console.log("resourceColumnMultiplier:", resourceColumnMultiplier);
        console.log("zoom:", zoom);
        console.log("minColumnWidth:", minColumnWidth);
        console.log("newWidth:", newWidth);
        console.log("======================");
        // Calculate new column width based on container width and total columns

        setcolumnWidth(newWidth);
      }
    };

    // Initial width calculation
    handleResize();

    // Update width on window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resourceColumnMultiplier, totalColumns, zoom, interval]);

  // Function to scroll to a specific time slot
  const scrollToTimeSlot = (targetHour: number, targetMinutes: number = 0) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Find the time slot index
      const targetTotalMinutes = targetHour * 60 + targetMinutes;
      const minutesPerSlot = interval === "quarter-hour" ? 15 : interval === "half-hour" ? 30 : 60;
      const timeSlotIndex = Math.floor(targetTotalMinutes / minutesPerSlot);
      
      const scrollPosition = timeSlotIndex * columnWidth;

      console.log("=== SCROLL TO TIME SLOT DEBUG ===");
      console.log("target time:", `${targetHour}:${targetMinutes.toString().padStart(2, "0")}`);
      console.log("totalContentWidth:", totalContentWidth);
      console.log("totalColumns:", totalColumns);
      console.log("columnWidth:", columnWidth);
      console.log("resourceColumnMultiplier:", resourceColumnMultiplier);
      console.log("timeSlotIndex:", timeSlotIndex);
      console.log("calculated scrollPosition:", scrollPosition);
      console.log("==================================");

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

  // Convenience function for backward compatibility
  const scrollToHour = (hour: number) => scrollToTimeSlot(hour, 0);

  // Auto-scroll to 8:00 AM on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToHour(8);
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  // Navigation functions
  const scrollToPreviousTimeSlot = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Find current time slot based on scroll position
      const currentColumnIndex = Math.round(currentScroll / columnWidth);
      const currentTimeSlotIndex = Math.max(0, currentColumnIndex - resourceColumnMultiplier);
      const prevTimeSlotIndex = Math.max(0, currentTimeSlotIndex - 1);
      
      if (prevTimeSlotIndex < timeSlots.length) {
        const prevSlot = timeSlots[prevTimeSlotIndex];
        scrollToTimeSlot(prevSlot.hour, prevSlot.minutes);
      }
    }
  };

  const scrollToNextTimeSlot = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const totalContentWidth = container.scrollWidth;
      const columnWidth = totalContentWidth / totalColumns;

      // Find current time slot based on scroll position
      const currentColumnIndex = Math.round(currentScroll / columnWidth);
      const currentTimeSlotIndex = Math.max(0, currentColumnIndex - resourceColumnMultiplier);
      const nextTimeSlotIndex = Math.min(timeSlots.length - 1, currentTimeSlotIndex + 1);
      
      if (nextTimeSlotIndex < timeSlots.length) {
        const nextSlot = timeSlots[nextTimeSlotIndex];
        scrollToTimeSlot(nextSlot.hour, nextSlot.minutes);
      }
    }
  };

  // Drag handle functions for resizing resource column
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartMultiplierRef.current = resourceColumnMultiplier;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [resourceColumnMultiplier]
  );

  // Debounce utility
  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // Debounced setter for resourceColumnMultiplier
  const debouncedSetResourceColumnMultiplier = useRef(
    debounce((value: number) => {
      setResourceColumnMultiplier((old) => (old !== value ? value : old));
    }, 16) // ~60fps
  ).current;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !scrollContainerRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      const width = scrollContainerRef.current.scrollWidth / totalColumns;
      const deltaMultiplier =
        deltaX > 0 ? Math.floor(deltaX / width) : Math.ceil(deltaX / width); // 47px is approx width of one column
      console.log(
        "Delta",
        deltaMultiplier,
        deltaX,
        width,
        deltaX / width,
        dragStartMultiplierRef.current,
        dragStartMultiplierRef.current + deltaMultiplier
      );
      const newMultiplier = Math.max(
        2,
        Math.min(8, dragStartMultiplierRef.current + deltaMultiplier)
      );

      debouncedSetResourceColumnMultiplier(newMultiplier);
    },
    [debouncedSetResourceColumnMultiplier, totalColumns]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Snap to nearest whole number when dragging ends
    const finalMultiplier = Math.max(
      2,
      Math.min(8, Math.round(resourceColumnMultiplier))
    );
    if (finalMultiplier !== resourceColumnMultiplier) {
      setResourceColumnMultiplier(finalMultiplier);
    }
  }, [resourceColumnMultiplier, handleMouseMove]);

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
      {/* Time Interval Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Interval:</span>
          <Button
            variant={interval === "hour" ? "default" : "outline"}
            size="sm"
            onClick={() => setInterval("hour")}
            className="h-8"
          >
            1 Hour
          </Button>
          <Button
            variant={interval === "half-hour" ? "default" : "outline"}
            size="sm"
            onClick={() => setInterval("half-hour")}
            className="h-8"
          >
            30 Min
          </Button>
          <Button
            variant={interval === "quarter-hour" ? "default" : "outline"}
            size="sm"
            onClick={() => setInterval("quarter-hour")}
            className="h-8"
          >
            15 Min
          </Button>
        </div>
      </div>

      {/* Resource Column Width Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Resource column width: {resourceColumnMultiplier}x
          </span>
          {[1, 2, 3, 4, 5, 6].map((multiplier) => (
            <Button
              key={multiplier}
              variant={
                Math.round(resourceColumnMultiplier) === multiplier
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setResourceColumnMultiplier(multiplier)}
              className="h-8"
            >
              {multiplier}x
            </Button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            (Drag to resize)
          </span>
        </div>
      </div>

      {/* Zoom Control */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Zoom: {zoom}x</span>
          <div className="flex items-center gap-2 w-48">
            <span className="text-xs text-muted-foreground">1x</span>
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground">10x</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToPreviousTimeSlot}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous {interval === "hour" ? "Hour" : interval === "half-hour" ? "30min" : "15min"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToNextTimeSlot}
            className="h-8"
          >
            Next {interval === "hour" ? "Hour" : interval === "half-hour" ? "30min" : "15min"}
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
            onClick={() => scrollToTimeSlot(12, 0)}
            className="h-8"
          >
            Go to 12:00 PM
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

      <div className="w-full relative" ref={containerRef}>
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Header */}
          <div
            className="grid sticky top-0 z-30 bg-background border-b"
            style={{
              gridTemplateColumns: `repeat(${resourceColumnMultiplier}, minmax(${minColumnWidth}px, 1fr)) repeat(${timeSlotCount}, minmax(${minColumnWidth}px, 1fr))`,
              minWidth: `calc(max(${100 * zoom}%, ${
                minColumnWidth * totalColumns
              }px))`,
            }}
          >
            {/* Empty resource columns for grid structure */}
            {Array.from({ length: resourceColumnMultiplier }).map((_, i) => (
              <div
                key={`empty-header-${i}`}
                className="border-r h-10"
                style={{ scrollSnapAlign: "start" }}
              />
            ))}

            {/* Time slot columns with proper snap alignment */}
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="text-center border-r px-1 py-2 h-10 flex items-center justify-center text-xs"
                style={{ scrollSnapAlign: "start" }}
              >
                {formatTime(slot.hour, slot.minutes)}
              </div>
            ))}
          </div>

          {data.map((car) => (
            <div
              key={car.carId}
              className="grid border-b h-12 text-sm hover:bg-default-50 transition-colors relative"
              style={{
                gridTemplateColumns: `repeat(${resourceColumnMultiplier}, minmax(${minColumnWidth}px, 1fr)) repeat(${timeSlotCount}, minmax(${minColumnWidth}px, 1fr))`,
                minWidth: `calc(max(${100 * zoom}%, ${
                  minColumnWidth * totalColumns
                }px))`,
              }}
            >
              {/* Empty resource columns for grid structure */}
              {Array.from({ length: resourceColumnMultiplier }).map((_, i) => (
                <div key={`empty-row-${i}`} className="border-r h-12" />
              ))}

              {/* Time slot columns with proper snap alignment */}
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border-r h-12 relative"
                  style={{ scrollSnapAlign: "start" }}
                />
              ))}

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
                const timelineWidthPercent = (timeSlotCount / totalColumns) * 100;
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

        {/* Sticky Resource Column Overlay */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: `calc(max(${columnWidth * resourceColumnMultiplier}px, ${
              minColumnWidth * resourceColumnMultiplier
            }px))`,
            height: "100%",
          }}
        >
          {/* Sticky Resource Header */}
          <div className="sticky top-0 left-0 px-3 py-2 font-medium border-r bg-background z-40 h-10 flex items-center text-sm pointer-events-auto">
            Resource
          </div>

          {/* Sticky Resource Names */}
          {data.map((car, index) => (
            <div
              key={car.carId}
              className="sticky left-0 px-3 py-2 font-medium border-r bg-background flex items-center h-12 text-sm z-30 border-b hover:bg-default-50 transition-colors pointer-events-auto"
            >
              {car.name}
            </div>
          ))}

          {/* Drag Handle for Resizing */}
          <div
            className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-blue-300 cursor-col-resize z-50 pointer-events-auto transition-colors"
            onMouseDown={handleMouseDown}
            title="Drag to resize resource column"
          >
            {/* Visible drag indicator */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
              <GripVertical className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
