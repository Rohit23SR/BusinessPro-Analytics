// Reusable Bar Chart component using D3.js
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface BarChartData {
  category: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  categoryKey?: string;
  valueKeys?: string[];
  colors?: string[];
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  animate?: boolean;
  onHover?: (data: BarChartData | null) => void;
  onClick?: (data: BarChartData) => void;
  className?: string;
}

const BarChart = ({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 60 },
  categoryKey = 'category',
  valueKeys = ['value'],
  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  orientation = 'vertical',
  showGrid = true,
  showLegend = true,
  stacked = false,
  animate = true,
  onHover,
  onClick,
  className = ''
}: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<BarChartData | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(valueKeys)
      .range(colors);

    let xScale: any, yScale: any;

    if (orientation === 'vertical') {
      // Vertical bars
      xScale = d3.scaleBand()
        .domain(data.map(d => d[categoryKey] as string))
        .range([0, innerWidth])
        .padding(0.2);

      if (stacked) {
        // Stacked data
        const stackedData = d3.stack<BarChartData>()
          .keys(valueKeys)
          (data);

        const maxY = d3.max(stackedData, series => d3.max(series, d => d[1])) || 0;

        yScale = d3.scaleLinear()
          .domain([0, maxY])
          .nice()
          .range([innerHeight, 0]);

        // Draw stacked bars
        stackedData.forEach((series, seriesIndex) => {
          const bars = g.selectAll(`.bar-${seriesIndex}`)
            .data(series)
            .enter().append("rect")
            .attr("class", `bar-${seriesIndex}`)
            .attr("x", d => xScale(d.data[categoryKey]))
            .attr("width", xScale.bandwidth())
            .attr("fill", colorScale(valueKeys[seriesIndex]))
            .style("cursor", onClick ? "pointer" : "default");

          if (animate) {
            bars
              .attr("y", innerHeight)
              .attr("height", 0)
              .transition()
              .duration(1000)
              .delay((d, i) => i * 100)
              .attr("y", d => yScale(d[1]))
              .attr("height", d => yScale(d[0]) - yScale(d[1]));
          } else {
            bars
              .attr("y", d => yScale(d[1]))
              .attr("height", d => yScale(d[0]) - yScale(d[1]));
          }

          // Add interactions
          bars
            .on("mouseenter", function(event, d) {
              d3.select(this).attr("opacity", 0.8);
              setHoveredData(d.data);
              onHover?.(d.data);

              if (tooltipRef.current) {
                const tooltip = d3.select(tooltipRef.current);
                tooltip
                  .style("opacity", 1)
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 10) + "px");
              }
            })
            .on("mouseleave", function() {
              d3.select(this).attr("opacity", 1);
              setHoveredData(null);
              onHover?.(null);

              if (tooltipRef.current) {
                d3.select(tooltipRef.current).style("opacity", 0);
              }
            })
            .on("click", function(event, d) {
              onClick?.(d.data);
            });
        });
      } else {
        // Grouped bars
        const subgroupScale = d3.scaleBand()
          .domain(valueKeys)
          .range([0, xScale.bandwidth()])
          .padding(0.05);

        const allValues = data.flatMap(d => valueKeys.map(key => Number(d[key]) || 0));
        yScale = d3.scaleLinear()
          .domain([0, d3.max(allValues) || 0])
          .nice()
          .range([innerHeight, 0]);

        // Draw grouped bars
        valueKeys.forEach((valueKey, keyIndex) => {
          const bars = g.selectAll(`.bar-${keyIndex}`)
            .data(data)
            .enter().append("rect")
            .attr("class", `bar-${keyIndex}`)
            .attr("x", d => (xScale(d[categoryKey]) || 0) + (subgroupScale(valueKey) || 0))
            .attr("width", subgroupScale.bandwidth())
            .attr("fill", colorScale(valueKey))
            .attr("rx", 4)
            .style("cursor", onClick ? "pointer" : "default");

          if (animate) {
            bars
              .attr("y", innerHeight)
              .attr("height", 0)
              .transition()
              .duration(1000)
              .delay((d, i) => i * 100 + keyIndex * 50)
              .attr("y", d => yScale(Number(d[valueKey]) || 0))
              .attr("height", d => innerHeight - yScale(Number(d[valueKey]) || 0));
          } else {
            bars
              .attr("y", d => yScale(Number(d[valueKey]) || 0))
              .attr("height", d => innerHeight - yScale(Number(d[valueKey]) || 0));
          }

          // Add interactions
          bars
            .on("mouseenter", function(event, d) {
              d3.select(this).attr("opacity", 0.8);
              setHoveredData(d);
              onHover?.(d);

              if (tooltipRef.current) {
                const tooltip = d3.select(tooltipRef.current);
                tooltip
                  .style("opacity", 1)
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 10) + "px");
              }
            })
            .on("mouseleave", function() {
              d3.select(this).attr("opacity", 1);
              setHoveredData(null);
              onHover?.(null);

              if (tooltipRef.current) {
                d3.select(tooltipRef.current).style("opacity", 0);
              }
            })
            .on("click", function(event, d) {
              onClick?.(d);
            });
        });
      }
    } else {
      // Horizontal bars (similar logic but with swapped axes)
      yScale = d3.scaleBand()
        .domain(data.map(d => d[categoryKey] as string))
        .range([0, innerHeight])
        .padding(0.2);

      const allValues = data.flatMap(d => valueKeys.map(key => Number(d[key]) || 0));
      xScale = d3.scaleLinear()
        .domain([0, d3.max(allValues) || 0])
        .nice()
        .range([0, innerWidth]);

      // Draw horizontal bars (simplified - grouped only)
      valueKeys.forEach((valueKey, keyIndex) => {
        const subgroupScale = d3.scaleBand()
          .domain(valueKeys)
          .range([0, yScale.bandwidth()])
          .padding(0.05);

        const bars = g.selectAll(`.bar-h-${keyIndex}`)
          .data(data)
          .enter().append("rect")
          .attr("class", `bar-h-${keyIndex}`)
          .attr("y", d => (yScale(d[categoryKey]) || 0) + (subgroupScale(valueKey) || 0))
          .attr("height", subgroupScale.bandwidth())
          .attr("fill", colorScale(valueKey))
          .attr("rx", 4)
          .style("cursor", onClick ? "pointer" : "default");

        if (animate) {
          bars
            .attr("x", 0)
            .attr("width", 0)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100 + keyIndex * 50)
            .attr("width", d => xScale(Number(d[valueKey]) || 0));
        } else {
          bars
            .attr("x", 0)
            .attr("width", d => xScale(Number(d[valueKey]) || 0));
        }
      });
    }

    // Grid lines
    if (showGrid) {
      if (orientation === 'vertical') {
        g.selectAll(".grid-line")
          .data(yScale.ticks())
          .enter().append("line")
          .attr("class", "grid-line")
          .attr("x1", 0)
          .attr("x2", innerWidth)
          .attr("y1", d => yScale(d))
          .attr("y2", d => yScale(d))
          .attr("stroke", "#f0f0f0")
          .attr("stroke-dasharray", "3,3");
      } else {
        g.selectAll(".grid-line")
          .data(xScale.ticks())
          .enter().append("line")
          .attr("class", "grid-line")
          .attr("x1", d => xScale(d))
          .attr("x2", d => xScale(d))
          .attr("y1", 0)
          .attr("y2", innerHeight)
          .attr("stroke", "#f0f0f0")
          .attr("stroke-dasharray", "3,3");
      }
    }

    // Axes
    if (orientation === 'vertical') {
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
    } else {
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d3.format(".0s")(d)))
        .attr("color", "#6b7280")
        .selectAll("text")
        .style("font-size", "12px");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .attr("color", "#6b7280")
        .selectAll("text")
        .style("font-size", "12px");
    }

  }, [data, width, height, margin, categoryKey, valueKeys, colors, orientation, showGrid, stacked, animate]);

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
              {hoveredData[categoryKey]}
            </div>
            {valueKeys.map((valueKey, index) => (
              <div key={valueKey} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-600">
                  {valueKey}: {d3.format(",")(Number(hoveredData[valueKey]) || 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && valueKeys.length > 1 && (
        <div className="flex items-center justify-center space-x-6 mt-4">
          {valueKeys.map((valueKey, index) => (
            <div key={valueKey} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-600 capitalize">
                {valueKey.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarChart;