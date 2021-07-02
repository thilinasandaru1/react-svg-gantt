import React, { createRef, useEffect, useState } from "react";
import { addHours, addDays, addMonths } from "date-fns";
import { startOf, clone } from "./src/utils/date";
import { createLayers, makeGrid, makeDates, setWidth } from "./src/utils/grid";
import { returnBar } from "./src/utils/item";

import "./styles/index.scss";
import { clearSVG } from "./src/utils/svg";

type TimelineProps = {
  groups: group[];
  items: item[];
  currentView: string;
  onItemClick: () => void;
};

type group = {
  title: string;
  id: number;
};

type item = {
  title: string;
  itemProps: ItemProps;
  id: number;
  start: number;
  end: number;
};

type ItemProps = {
  bgColor: string;
  startDate: number;
  endDate: number;
};

const VIEW_MODE = {
  HOUR: "hours",
  DAY: "days",
  WEEK: "weeks",
};

const Timeline: React.FC<TimelineProps> = ({
  groups,
  currentView,
  items,
  onItemClick,
}: TimelineProps) => {
  const _svg_timeline = createRef<SVGSVGElement>();
  const _svg_groups = createRef<SVGSVGElement>();
  const _svg_header = createRef<SVGSVGElement>();
  const _div_groups = createRef<HTMLDivElement>();

  const [barHeight] = useState(28);
  const [barContainerRadius] = useState(4);
  const [headerHeight] = useState(30);
  const [padding] = useState(25);
  const [step, setStep] = useState(24);
  const [columnWidth, setColumnWidth] = useState(30);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dates, setDates] = useState<Date[]>();

  const changeViewMode = () => {
    updateViewScale();
    setupDates();
  };

  const renderGantt = async () => {
    if (dates && _svg_timeline && _svg_timeline.current) {
      const options = {
        columnWidth,
        headerHeight,
        padding,
        barHeight,
        currentView,
        dates,
      };

      clearSVG(_svg_timeline, _svg_header, _svg_groups);
      createLayers(_svg_timeline, _svg_header, _svg_groups);
      makeGrid(
        items,
        groups,
        _svg_timeline,
        _svg_header,
        _svg_groups,
        _div_groups,
        options
      );
      makeDates(_svg_header, options);
      renderItems();
      setWidth(_svg_timeline);
    }
  };

  const viewIs = (mode: string): boolean => {
    if (currentView && currentView === mode) {
      return true;
    }
    return false;
  };

  const updateViewScale = () => {
    if (currentView === VIEW_MODE.HOUR) {
      setStep(24 / 24);
      setColumnWidth(38);
    } else if (currentView === VIEW_MODE.DAY) {
      setStep(24);
      setColumnWidth(38);
    } else if (currentView === VIEW_MODE.WEEK) {
      setStep(24 * 7);
      setColumnWidth(120);
    }
  };

  const setupDates = async () => {
    let start_date = 0;
    let end_date = 0;

    for (const item of items) {
      if (start_date === 0 || item.start < start_date) {
        start_date = item.start;
      }

      if (end_date === 0 || item.end > end_date) {
        end_date = item.end;
      }
    }

    setStartDate(startOf(new Date(start_date), "day"));
    setEndDate(startOf(new Date(end_date), "day"));
  };

  const getGanttValues = () => {
    const _dates = [];
    let current_date;
    if (startDate && endDate) {
      while (!current_date || (current_date && current_date < endDate)) {
        if (!current_date) {
          current_date = clone(startDate);
        } else {
          if (viewIs(VIEW_MODE.HOUR)) {
            current_date = addHours(current_date, 1);
          } else if (viewIs(VIEW_MODE.DAY)) {
            current_date = addDays(current_date, 1);
          } else if (viewIs(VIEW_MODE.WEEK)) {
            current_date = addMonths(current_date, 1);
          }
        }

        if (isValidDate(current_date)) {
          _dates.push(current_date);
        }
      }
    }
    setDates(_dates);
  };

  const isValidDate = (currentDate: Date) => {
    if (viewIs(VIEW_MODE.HOUR)) {
      return currentDate.getHours();
    } else if (viewIs(VIEW_MODE.DAY)) {
      return currentDate ? true : false;
    } else if (viewIs(VIEW_MODE.WEEK)) {
      return currentDate ? true : false;
    }
  };

  const renderItems = () => {
    if (_svg_timeline && _svg_timeline.current) {
      const barLayer = _svg_timeline.current.querySelector(".bar");

      if (barLayer) {
        items.map((item, index) => {
          const options = {
            columnWidth,
            step,
            padding,
            headerHeight,
            barHeight,
            barContainerRadius,
            startDate,
            onItemClick,
          };
          const bar = returnBar(item, index, options);

          barLayer.appendChild(bar);
        });
      }
    }
  };

  useEffect(() => {
    renderGantt();
    console.log("renderGantt");
  }, [dates]);

  useEffect(() => {
    changeViewMode();
    getGanttValues();
  }, [items, groups, currentView]);

  return (
    <div>
      {items && items.length > 0 ? (
        <div className="gantt-container">
          <div className="gantt-groups" ref={_div_groups}>
            <div className="gantt-groups-header" />

            <div>
              <svg
                ref={_svg_groups}
                className="gantt-groups-svg"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              />
            </div>
          </div>
          <div className="gantt-body">
            <div className="gantt-header">
              <svg
                ref={_svg_header}
                className="gantt-header-svg"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              />
            </div>

            <div className="gantt-timeline">
              <svg
                ref={_svg_timeline}
                className="gantt"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              />
            </div>
          </div>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default Timeline;
