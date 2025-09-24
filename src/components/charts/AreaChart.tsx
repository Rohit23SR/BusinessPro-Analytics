// Reusable Area Chart component using D3.js
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface AreaChartData {
  x: string | number | Date;
  y: number;
  series?: string;
  [key: string]: any;
}

interface AreaChartProps {
  data: AreaChartData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  xKey?: string;
  yKey?: string;
  gradientColors?: [string, string];
  strokeColor?: string;
  showGrid?: boolean;
  showDots?: boolean;
  showBaseline?: boolean;
  animate?: boolean;
  curve?: 'linear' | 'monotone' | 'step' | 'basis';
  onHover?: (data: AreaChartData | null) => void;
  className?: string;
}

const AreaChart = ({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 60 },
  xKey = 'x',
  yKey = 'y',
  gradientColors = ['#6366f1', '#e0e7ff'],
  strokeColor = '#6366f1',
  showGrid = true,
  showDots = false,
  showBaseline = false,
  animate = true,
  curve = 'monotone',
  onHover,
  className = ''
}: AreaChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<AreaChartData | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", innerHeight)
      .attr("x2", 0).attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", gradientColors[1])
      .attr("stop-opacity", 0.1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", gradientColors[0])
      .attr("stop-opacity", 0.4);

    // Scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => String(d[xKey])))
      .range([0, innerWidth])
      .padding(0.1);

    const yValues = data.map(d => d[yKey]);
    const yScale = d3.scaleLinear()
      .domain(d3.extent(yValues) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
    if (showGrid) {
      // Horizontal grid lines
      g.selectAll(".grid-line-horizontal")
        .data(yScale.ticks())
        .enter().append("line")
        .attr("class", "grid-line-horizontal")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("stroke", "#f0f0f0")
        .attr("stroke-dasharray", "3,3");

      // Vertical grid lines
      g.selectAll(".grid-line-vertical")
        .data(data.filter((d, i) => i % Math.ceil(data.length / 6) === 0))
        .enter().append("line")
        .attr("class", "grid-line-vertical")
        .attr("x1", d => xScale(String(d[xKey])) || 0)
        .attr("x2", d => xScale(String(d[xKey])) || 0)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#f9f9f9")
        .attr("stroke-dasharray", "2,2");
    }

    // Baseline
    if (showBaseline) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#6b7280")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
    }

    // Area and line generators
    const curveType = {
      linear: d3.curveLinear,
      monotone: d3.curveMonotoneX,
      step: d3.curveStep,
      basis: d3.curveBasis
    }[curve];

    const area = d3.area<AreaChartData>()
      .x(d => xScale(String(d[xKey])) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d[yKey]))
      .curve(curveType);

    const line = d3.line<AreaChartData>()
      .x(d => xScale(String(d[xKey])) || 0)
      .y(d => yScale(d[yKey]))
      .curve(curveType);

    // Draw area
    const areaPath = g.append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    // Draw line
    const linePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("d", line);

    // Animation
    if (animate) {
      // Animate area
      areaPath
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

      // Animate line
      const totalLength = linePath.node()?.getTotalLength() || 0;
      linePath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    }

    // Dots
    if (showDots) {
      const dots = g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(String(d[xKey])) || 0)
        .attr("cy", d => yScale(d[yKey]))
        .attr("r", 0)
        .attr("fill", strokeColor)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      if (animate) {
        dots
          .transition()
          .delay(1500)
          .duration(500)
          .attr("r", 4);
      } else {
        dots.attr("r", 4);
      }
    }

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr("color", "#6b7280")
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => d3.format(".0s")(d)))
      .attr("color", "#6b7280")
      .selectAll("text")
      .style("font-size", "12px");

    // Interactive overlay
    const overlay = g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all");

    // Hover line
    const hoverLine = g.append("line")
      .attr("stroke", "#6b7280")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .style("opacity", 0);

    // Hover dot
    const hoverDot = g.append("circle")
      .attr("r", 6)
      .attr("fill", strokeColor)
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("opacity", 0);

    // Mouse interactions
    overlay
      .on("mousemove", function(event) {
        const [mouseX] = d3.pointer(event);
        
        // Find closest data point
        const bisect = d3.bisector((d: AreaChartData) => xScale(String(d[xKey])) || 0).left;
        const index = bisect(data, mouseX);
        const d0 = data[index - 1];
        const d1 = data[index];
        
        let selectedData;
        if (!d0) selectedData = d1;
        else if (!d1) selectedData = d0;
        else {
          const x0 = xScale(String(d0[xKey])) || 0;
          const x1 = xScale(String(d1[xKey])) || 0;
          selectedData = mouseX - x0 > x1 - mouseX ? d1 : d0;
        }

        if (selectedData) {
          const x = xScale(String(selectedData[xKey])) || 0;
          const y = yScale(selectedData[yKey]);

          // Update hover elements
          hoverLine
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .style("opacity", 1);

          hoverDot
            .attr("cx", x)
            .attr("cy", y)
            .style("opacity", 1);

          setHoveredData(selectedData);
          onHover?.(selectedData);

          // Position tooltip
          if (tooltipRef.current) {
            const tooltip = d3.select(tooltipRef.current);
            tooltip
              .style("opacity", 1)
              .style("left", (event.offsetX + 10) + "px")
              .style("top", (event.offsetY - 10) + "px");
          }
        }
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0);
        hoverDot.style("opacity", 0);
        setHoveredData(null);
        onHover?.(null);

        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style("opacity", 0);
        }
      });

  }, [data, width, height, margin, xKey, yKey, gradientColors, strokeColor, showGrid, showDots, showBaseline, animate, curve]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none opacity-0 transition-opacity z-10"
        style={{ fontSize: '12px' }}
      >
        {hoveredData && (
          <div>
            <div className="font-medium text-gray-900 mb-1">
              {String(hoveredData[xKey])}
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: strokeColor }}
              />
              <span className="text-gray-600">
                Value: {d3.format(",")(hoveredData[yKey])}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaChart;