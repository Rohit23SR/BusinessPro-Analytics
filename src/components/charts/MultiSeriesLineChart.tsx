import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// More flexible data point interface
type DataPoint = Record<string, string | number | Date>;

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

interface MultiSeriesLineChartProps {
  data: DataPoint[];
  series: SeriesConfig[];
  xKey?: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  referenceLines?: Array<{
    y?: number;
    x?: string;
    label?: string;
    color?: string;
  }>;
}

const MultiSeriesLineChart: React.FC<MultiSeriesLineChartProps> = ({
  data,
  series,
  xKey = 'x',
  width = 800,
  height = 400,
  margin = { top: 50, right: 120, bottom: 80, left: 80 },
  title = "Multi-Series Line Chart",
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  showGrid = true,
  showLegend = true,
  referenceLines = []
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !series || series.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse dates if x values are dates
    const parseTime = d3.timeParse("%Y-%m-%d");
    const processedData = data.map(d => {
      const processed = { ...d };
      const xValue = processed[xKey];
      if (typeof xValue === 'string' && xValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        processed[xKey] = parseTime(xValue) || xValue;
      }
      return processed;
    });

    // Determine if x values are dates
    const isTimeScale = processedData[0][xKey] instanceof Date;

    // Create scales
    const xScale = isTimeScale
      ? d3.scaleTime()
          .domain(d3.extent(processedData, d => d[xKey] as Date) as [Date, Date])
          .range([0, innerWidth])
      : d3.scalePoint()
          .domain(processedData.map(d => String(d[xKey])))
          .range([0, innerWidth])
          .padding(0.1);

    // Get all y values from all series
    const allYValues: number[] = [];
    series.forEach(s => {
      processedData.forEach(d => {
        const value = d[s.key];
        if (typeof value === 'number') {
          allYValues.push(value);
        }
      });
    });

    const yScale = d3.scaleLinear()
      .domain(d3.extent(allYValues) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title);

    // Add grid lines
    if (showGrid) {
      // Horizontal grid lines
      g.selectAll('.grid-line-horizontal')
        .data(yScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'grid-line-horizontal')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .style('stroke', '#f0f0f0')
        .style('stroke-width', '1px');

      // Vertical grid lines (only for non-time scales)
      if (!isTimeScale) {
        const xTicks = (xScale as d3.ScalePoint<string>).domain();
        g.selectAll('.grid-line-vertical')
          .data(xTicks)
          .enter()
          .append('line')
          .attr('class', 'grid-line-vertical')
          .attr('x1', d => (xScale as d3.ScalePoint<string>)(d) || 0)
          .attr('x2', d => (xScale as d3.ScalePoint<string>)(d) || 0)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .style('stroke', '#f0f0f0')
          .style('stroke-width', '1px');
      }
    }

    // Reference Lines
    referenceLines.forEach((refLine, index) => {
      if (refLine.y !== undefined) {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', yScale(refLine.y))
          .attr('y2', yScale(refLine.y))
          .style('stroke', refLine.color || '#94a3b8')
          .style('stroke-dasharray', '5 5')
          .style('stroke-width', '2px');
        
        if (refLine.label) {
          g.append('text')
            .attr('x', innerWidth - 10)
            .attr('y', yScale(refLine.y) - 5)
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .style('fill', refLine.color || '#94a3b8')
            .text(refLine.label);
        }
      }
    });

    // Draw lines for each series
    series.forEach((s, seriesIndex) => {
      // Filter data for this series (only include points where the series value is a number)
      const seriesData = processedData.filter(d => typeof d[s.key] === 'number');
      
      if (seriesData.length === 0) return;

      // Create line generator
      const line = d3.line<DataPoint>()
        .x(d => {
          if (isTimeScale) {
            return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
          } else {
            return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
          }
        })
        .y(d => yScale(d[s.key] as number))
        .curve(d3.curveMonotoneX);

      // Draw the line
      g.append('path')
        .datum(seriesData)
        .attr('class', `line-${s.key}`)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', s.strokeWidth || 2)
        .attr('stroke-dasharray', s.strokeDasharray || 'none')
        .attr('d', line);

      // Add dots for each data point
      g.selectAll(`.dot-${seriesIndex}`)
        .data(seriesData)
        .enter()
        .append('circle')
        .attr('class', `dot-${seriesIndex}`)
        .attr('cx', d => {
          if (isTimeScale) {
            return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
          } else {
            return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
          }
        })
        .attr('cy', d => yScale(d[s.key] as number))
        .attr('r', 4)
        .style('fill', s.color)
        .style('stroke', '#fff')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          // Tooltip
          const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000');

          tooltip.html(`${s.name}: ${d[s.key]}<br/>${xAxisLabel}: ${d[xKey]}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

          d3.select(this).attr('r', 6);
        })
        .on('mouseout', function() {
          d3.selectAll('.tooltip').remove();
          d3.select(this).attr('r', 4);
        });
    });

    // Add x-axis
    const xAxisGenerator = isTimeScale
      ? d3.axisBottom(xScale as d3.ScaleTime<number, number>)
          .tickFormat(d3.timeFormat("%b %Y") as any)
      : d3.axisBottom(xScale as d3.ScalePoint<string>);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxisGenerator)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#666')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0s')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#666');

    // Add axis labels
    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#666')
      .text(xAxisLabel);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerHeight / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#666')
      .text(yAxisLabel);

    // Add legend
    if (showLegend) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${width - 100}, ${margin.top})`);

      const legendItems = legend
        .selectAll('.legend-item')
        .data(series)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`);

      legendItems
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .style('stroke', d => d.color)
        .style('stroke-width', d => d.strokeWidth || 2)
        .style('stroke-dasharray', d => d.strokeDasharray || 'none');

      legendItems
        .append('circle')
        .attr('cx', 10)
        .attr('cy', 0)
        .attr('r', 3)
        .style('fill', d => d.color);

      legendItems
        .append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#333')
        .text(d => d.name);
    }

  }, [data, series, xKey, width, height, margin, title, xAxisLabel, yAxisLabel, showGrid, showLegend, referenceLines]);

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        />
      </div>
    </div>
  );
};

export default MultiSeriesLineChart;