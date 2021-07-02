import { createSVG, setAttr } from "./svg";
import { format, addYears } from "date-fns";

export const createLayers = (svgRef, svgHeaderRef, svgGroupsRef) => {
  const _layers = ["grid", "bar", "details"];
  const layers = [];

  if (svgRef.current) {
    for (let layer of _layers) {
      layers[layer] = createSVG("g", {
        class: layer,
        append_to: svgRef.current,
      });
    }
  }

  if (svgHeaderRef.current) {
    createSVG("g", {
      class: "grid",
      append_to: svgHeaderRef.current,
    });

    createSVG("g", {
      class: "date",
      append_to: svgHeaderRef.current,
    });
  }

  if (svgGroupsRef.current) {
    createSVG("g", {
      class: "grid",
      append_to: svgGroupsRef.current,
    });
  }

  if (svgGroupsRef.current) {
    createSVG("g", {
      class: "group",
      append_to: svgGroupsRef.current,
    });
  }
};

export const makeGrid = (
  items,
  groups,
  svgRef,
  svgHeaderRef,
  svgGroupsRef,
  divGroupRef,
  options
) => {
  makeGridBackground(items.length, svgRef, svgGroupsRef, divGroupRef, options);
  makeGridGroupsRows(svgGroupsRef, items, options);
  makeGroupsTexts(svgGroupsRef, groups, options);
  makeGridRows(svgRef, items, options);
  makeGridHeader(svgHeaderRef, options);
  makeGridTicks(svgRef, items, options);
};

export const makeGridBackground = (
  itemsLength,
  svgRef,
  svgGroupsRef,
  divGroupRef,
  options
) => {
  if (options.dates && svgRef) {
    const gridWidth = Number(options.dates.length * options.columnWidth);
    const gridHeight = Number(
      options.padding + (options.barHeight + options.padding) * itemsLength
    );
    const gridLayer = svgRef.current.querySelector(".grid");

    createSVG("rect", {
      x: 0,
      y: 0,
      width: gridWidth,
      height: gridHeight >= 650 ? gridHeight : 650,
      class: "grid-background",
      append_to: gridLayer,
    });
    setAttr(svgRef.current, {
      height: gridHeight >= 650 ? gridHeight : 650,
      width: "100%",
    });

    setAttr(svgGroupsRef.current, {
      height: gridHeight >= 650 ? gridHeight : 650,
      width: "100%",
    });

    setAttr(divGroupRef.current, {
      style: `height: ${gridHeight >= 650 ? gridHeight : 650 + 80}px`,
    });
  }
};

export const makeGridRows = (svgRef, items, options) => {
  if (options.dates && svgRef.current) {
    const gridLayer = svgRef.current.querySelector(".grid");
    const rows_layer = createSVG("g", { append_to: gridLayer });

    const row_width = options.dates.length * options.columnWidth;
    const row_height = options.barHeight + options.padding;

    let row_y = options.padding - 25;

    for (let i = 0; i <= 20; i++) {
      createSVG("rect", {
        x: 0,
        y: row_y,
        width: row_width,
        height: row_height,
        class: "grid-row",
        append_to: rows_layer,
      });

      row_y += options.barHeight + options.padding;
    }
  }
};

export const makeGridGroupsRows = (svgRef, groups, options) => {
  if (options.dates && svgRef.current) {
    const gridLayer = svgRef.current.querySelector(".grid");
    const rows_layer = createSVG("g", { append_to: gridLayer });

    const row_height = options.barHeight + options.padding;

    let row_y = options.padding - 25;

    for (let i = 0; i <= 20; i++) {
      createSVG("rect", {
        x: 0,
        y: row_y,
        width: 230,
        height: row_height,
        class: "grid-group-row",
        append_to: rows_layer,
      });

      row_y += options.barHeight + options.padding;
    }
  }
};

export const makeGroupsTexts = (svgGroupsRef, groups, options) => {
  if (svgGroupsRef.current && groups) {
    const groupLayer = svgGroupsRef.current.querySelector(".group");

    let y = options.padding + 10;
    const text_height = options.barHeight + options.padding;

    groups.forEach((group) => {
      createSVG("text", {
        x: 20,
        y: y,
        innerHTML: group.title,
        height: text_height,
        class: "group-title",
        append_to: groupLayer,
      });

      y += options.barHeight + options.padding;
    });
  }
};

export const makeGridHeader = (svgRef, options) => {
  if (options.dates) {
    const gridLayer = svgRef.current.querySelector(".grid");
    const header_width = options.dates.length * options.columnWidth;
    const header_height = options.headerHeight;

    createSVG("rect", {
      x: 0,
      y: 0,
      width: header_width,
      height: header_height + 20,
      class: "grid-top-header",
      append_to: gridLayer,
    });
    createSVG("line", {
      x1: 0,
      y1: 50,
      x2: header_width,
      y2: 50,
      class: "grid-header-border",
      append_to: gridLayer,
    });
    createSVG("rect", {
      x: 0,
      y: 50,
      width: header_width,
      height: header_height,
      class: "grid-bottom-header",
      append_to: gridLayer,
    });
  }
};

export const makeGridTicks = (svgRef, items, options) => {
  if (options.dates && svgRef.current) {
    const gridLayer = svgRef.current.querySelector(".grid");
    let tick_x = 0;
    let tick_y = 0;
    let tick_height =
      (options.barHeight + options.padding) * items.length + 700;

    for (let date of options.dates) {
      let tick_class = "tick";
      // thick tick for monday

      if (options.currentView === "hours" && Number(date.getHours()) === 8) {
        tick_class += " thick";
      }

      createSVG("path", {
        d: `M ${tick_x} ${tick_y} v ${tick_height}`,
        class: tick_class,
        append_to: gridLayer,
      });

      if (options.currentView === "weeks" && (date.getMonth() + 1) % 3 === 0) {
        tick_class += " thick";
      }

      createSVG("path", {
        d: `M ${tick_x} ${tick_y} v ${tick_height}`,
        class: tick_class,
        append_to: gridLayer,
      });

      tick_x += options.columnWidth;
    }
  }
};

export const makeDates = (svgRef, options) => {
  const dateLayer = svgRef.current.querySelector(".date");
  const gridLayer = svgRef.current.querySelector(".grid");

  if (options.dates && svgRef.current) {
    for (let date of getDatesToDraw(
      options.dates,
      options.columnWidth,
      options.headerHeight,
      options.currentView
    )) {
      createSVG("text", {
        x: date.lower_x - 25,
        y: date.lower_y,
        innerHTML: date.lower_text,
        class: "lower-text",
        append_to: dateLayer,
      });

      if (date.upper_text) {
        const upperText = createSVG("text", {
          x: date.upper_x - 210,
          y: date.upper_y,
          innerHTML: date.upper_text,
          class: "upper-text",
          append_to: dateLayer,
        });

        if (upperText.getBBox().x2 > gridLayer.getBBox().width) {
          upperText.remove();
        }
      }
    }
  }
};

export const getDatesToDraw = (
  dates,
  columnWidth,
  headerHeight,
  currentView
) => {
  let last_date = null;
  const _dates = dates.map((date, i) => {
    const d = getDateInfo(
      date,
      last_date,
      i,
      columnWidth,
      headerHeight,
      currentView
    );
    last_date = date;
    return d;
  });

  return _dates;
};

export const getDateInfo = (
  date,
  last_date,
  i,
  columnWidth,
  headerHeight,
  currentView
) => {
  if (!last_date) {
    last_date = addYears(date, 1);
  }

  const date_text = {
    hours_lower: format(date, "HH"),
    days_lower: date.getDate() !== last_date.getDate() ? format(date, "d") : "",
    weeks_lower:
      date.getMonth() !== last_date.getMonth() ? format(date, "d") : "",

    hours_upper:
      date.getDate() !== last_date.getDate()
        ? date.getMonth() !== last_date.getMonth()
          ? format(date, "d MMM")
          : format(date, "d MMM")
        : "",
    days_upper:
      date.getMonth() !== last_date.getMonth() ? format(date, "MMMM") : "",
    weeks_upper:
      date.getMonth() !== last_date.getMonth() ? format(date, "MMMM") : "",
  };

  const base_pos = {
    x: i * columnWidth,
    lower_y: headerHeight + 38,
    upper_y: headerHeight,
  };

  const x_pos = {
    hours_lower: (columnWidth * 2) / 2,
    hours_upper: 0,
    days_lower: columnWidth / 2,
    days_upper: (columnWidth * 30) / 2,
    weeks_lower: 0,
    weeks_upper: (columnWidth * 4) / 2,
  };

  return {
    upper_text: date_text[`${currentView}_upper`],
    lower_text: date_text[`${currentView}_lower`],
    upper_x: base_pos.x + x_pos[`${currentView}_upper`],
    upper_y: base_pos.upper_y,
    lower_x: base_pos.x + x_pos[`${currentView}_lower`],
    lower_y: base_pos.lower_y,
  };
};

export const setWidth = (svgRef) => {
  if (svgRef && svgRef.current) {
    const currentWidth = Number(svgRef.current.getBoundingClientRect().width);
    const actualWidth = Number(
      svgRef.current.querySelector(".grid .grid-row")?.getAttribute("width")
    );

    if (currentWidth < actualWidth) {
      svgRef.current.setAttribute("width", String(actualWidth));
    }
  }
};
