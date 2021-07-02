import { diff } from "./date";
import { createSVG } from "./svg";

export const returnBar = (item, index, options) => {
  const x = computeX(item, options);
  const y = computeY(index, options);

  const duration = diff(item.end, item.start, "hour") / options.step;
  const width = options.columnWidth * duration;

  const group = createSVG("g", {
    class: "bar-wrapper",
    "data-id": item.id,
  });

  const itemGroup = createSVG("g", {
    class: "bar-group",
    append_to: group,
  });

  prepareHelpers();
  drawItems(x, y, width, itemGroup, item, options);

  return group;
};

export const computeX = (item, options) => {
  const _diff = diff(item.start, options.startDate, "hour");
  let x = (_diff / options.step) * options.columnWidth;

  if (options.currentView === "weeks") {
    const _diff = diff(item.start, options.startDate, "day");
    x = (_diff * options.columnWidth) / 30;
  }

  return x;
};

export const computeY = (index, options) => {
  return options.padding + index * (options.barHeight + options.padding) - 12;
};

export const prepareHelpers = () => {
  SVGElement.prototype.getX = function () {
    return +this.getAttribute("x");
  };
  SVGElement.prototype.getY = function () {
    return +this.getAttribute("y");
  };
  SVGElement.prototype.getWidth = function () {
    return +this.getAttribute("width");
  };
  SVGElement.prototype.getHeight = function () {
    return +this.getAttribute("height");
  };
  SVGElement.prototype.getEndX = function () {
    return this.getX() + this.getWidth();
  };
};

export const drawItems = (x, y, width, itemGroup, item, options) => {
  drawBar(x, y, width, itemGroup, item, options);
  drawLabel(x, y, width, itemGroup, item, options);
};

export const drawBar = (x, y, width, itemGroup, item, options) => {
  createSVG("rect", {
    x: x,
    y: y,
    fill: item.itemProps.backgroundColor,
    width: width,
    height: options.barHeight,
    rx: options.barContainerRadius,
    ry: options.barContainerRadius,
    class: "bar",
    append_to: itemGroup,
    on_click: [options.onItemClick, item],
  });
};

export const drawLabel = (x, y, width, itemGroup, item, options) => {
  createSVG("text", {
    x: x + width / 2,
    y: y + options.barHeight / 2,
    innerHTML: item.title,
    class: "bar-label",
    append_to: itemGroup,
    on_click: [options.onItemClick, item],
  });
};
