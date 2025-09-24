import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  x: string | number | Date;
  y: number;
  [key: string]: string | number | Date;
}

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

interface LineChartProps {
  data: DataPoint[];
  series?: SeriesConfig[];
  xKey?: string;
  yKey?: string;
  width?: number | string;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  responsive?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  series = [],
  xKey = 'x',
  yKey = 'y',
  width = '100%',
  height = 400,
  margin = { top: 20, right: 30, bottom: 80, left: 80 },
  title = "",
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  showGrid = true,
  showLegend = true,
  showDots = true,
  responsive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: height });

  // Enhanced responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && responsive) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        // Better responsive calculations
        const calculatedWidth = typeof width === 'string' 
          ? Math.max(containerWidth - 32, 320) 
          : width as number;
          
        const calculatedHeight = containerHeight > 0 && containerHeight !== height 
          ? containerHeight 
          : height;
        
        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight
        });
      } else if (typeof width === 'number') {
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    
    if (responsive) {
      // Use ResizeObserver for better performance
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateDimensions);
      });
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [width, height, responsive]);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const actualWidth = dimensions.width;
    const actualHeight = dimensions.height;
    
    // Responsive margin adjustments
    const isMobile = actualWidth < 600;
    const responsiveMargin = {
      top: margin.top,
      right: isMobile ? Math.max(margin.right - 30, 15) : margin.right,
      bottom: isMobile ? Math.max(margin.bottom - 20, 60) : margin.bottom,
      left: isMobile ? Math.max(margin.left - 30, 40) : margin.left
    };
    
    const innerWidth = Math.max(actualWidth - responsiveMargin.left - responsiveMargin.right, 200);
    const innerHeight = Math.max(actualHeight - responsiveMargin.top - responsiveMargin.bottom, 150);

    // Parse dates if x values are dates
    const parseTime = d3.timeParse("%Y-%m-%d");
    const processedData = data.map(d => ({
      ...d,
      [xKey]: typeof d[xKey] === 'string' && String(d[xKey]).match(/^\d{4}-\d{2}-\d{2}$/) 
        ? parseTime(String(d[xKey])) || d[xKey] 
        : d[xKey]
    }));

    // Better domain calculation for multiple series
    const allYValues = series.length > 0 
      ? processedData.flatMap(d => series.map(s => d[s.key] as number).filter(v => typeof v === 'number'))
      : processedData.map(d => d[yKey] as number).filter(v => typeof v === 'number');

    const yExtent = d3.extent(allYValues) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

    // Create scales
    const xScale = processedData[0][xKey] instanceof Date
      ? d3.scaleTime()
          .domain(d3.extent(processedData, d => d[xKey] as Date) as [Date, Date])
          .range([0, innerWidth])
      : d3.scalePoint()
          .domain(processedData.map(d => String(d[xKey])))
          .range([0, innerWidth])
          .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .nice()
      .range([innerHeight, 0]);

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${responsiveMargin.left},${responsiveMargin.top})`);

    // Add title (responsive font size)
    if (title) {
      svg
        .append('text')
        .attr('x', actualWidth / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', isMobile ? '14px' : '16px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(title);
    }

    // Add grid lines with better styling
    if (showGrid) {
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

      if (!(processedData[0][xKey] instanceof Date)) {
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

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => {
        if (processedData[0][xKey] instanceof Date) {
          return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
        } else {
          return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
        }
      })
      .y(d => yScale(d[yKey] as number))
      .curve(d3.curveMonotoneX);

    // Draw lines and dots
    if (series.length > 0) {
      series.forEach((s, index) => {
        const seriesData = processedData.filter(d => typeof d[s.key] === 'number');
        
        const seriesLine = d3.line<DataPoint>()
          .x(d => {
            if (processedData[0][xKey] instanceof Date) {
              return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
            } else {
              return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
            }
          })
          .y(d => yScale(d[s.key] as number))
          .curve(d3.curveMonotoneX);

        // Draw line with animation
        const path = g.append('path')
          .datum(seriesData)
          .attr('class', `line-${s.key}`)
          .attr('fill', 'none')
          .attr('stroke', s.color)
          .attr('stroke-width', s.strokeWidth || 2)
          .attr('stroke-dasharray', s.strokeDasharray || 'none')
          .attr('d', seriesLine);

        // Line animation
        const pathLength = path.node()?.getTotalLength?.() || 0;
        if (pathLength > 0) {
          path
            .attr('stroke-dasharray', pathLength + ' ' + pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(1500)
            .delay(index * 300)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0)
            .on('end', function() {
              d3.select(this).attr('stroke-dasharray', s.strokeDasharray || 'none');
            });
        }

        // Add dots with animation and hover effects
        if (showDots) {
          g.selectAll(`.dot-${index}`)
            .data(seriesData)
            .enter()
            .append('circle')
            .attr('class', `dot-${index}`)
            .attr('cx', d => {
              if (processedData[0][xKey] instanceof Date) {
                return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
              } else {
                return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
              }
            })
            .attr('cy', d => yScale(d[s.key] as number))
            .attr('r', 0)
            .style('fill', s.color)
            .style('stroke', '#fff')
            .style('stroke-width', '2px')
            .style('cursor', 'pointer')
            .transition()
            .duration(400)
            .delay((d, i) => 1500 + (index * 300) + (i * 80))
            .ease(d3.easeBackOut)
            .attr('r', isMobile ? 3 : 4)
            .selection()
            .on('mouseover', function(event, d) {
              const tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0,0,0,0.9)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)');

              tooltip.html(`${s.name}: ${d3.format(",")(d[s.key] as number)}<br/>${xAxisLabel}: ${d[xKey]}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');

              d3.select(this).transition().duration(200).attr('r', isMobile ? 5 : 6);
            })
            .on('mouseout', function() {
              d3.selectAll('.tooltip').remove();
              d3.select(this).transition().duration(200).attr('r', isMobile ? 3 : 4);
            });
        }
      });
    } else {
      // Single line
      const path = g.append('path')
        .datum(processedData)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line);

      const pathLength = path.node()?.getTotalLength?.() || 0;
      if (pathLength > 0) {
        path
          .attr('stroke-dasharray', pathLength + ' ' + pathLength)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
      }

      if (showDots) {
        g.selectAll('.dot')
          .data(processedData)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('cx', d => {
            if (processedData[0][xKey] instanceof Date) {
              return (xScale as d3.ScaleTime<number, number>)(d[xKey] as Date);
            } else {
              return (xScale as d3.ScalePoint<string>)(String(d[xKey])) || 0;
            }
          })
          .attr('cy', d => yScale(d[yKey] as number))
          .attr('r', 0)
          .style('fill', '#3b82f6')
          .style('stroke', '#fff')
          .style('stroke-width', '2px')
          .style('cursor', 'pointer')
          .transition()
          .duration(400)
          .delay((d, i) => 1500 + (i * 80))
          .ease(d3.easeBackOut)
          .attr('r', isMobile ? 3 : 4);
      }
    }

    // Add axes with responsive font sizes
    let xAxis;
    if (processedData[0][xKey] instanceof Date) {
      xAxis = d3.axisBottom(xScale as d3.ScaleTime<number, number>)
        .tickFormat(d3.timeFormat("%b %Y") as any);
    } else {
      xAxis = d3.axisBottom(xScale as d3.ScalePoint<string>);
    }

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', isMobile ? '10px' : '12px')
      .style('fill', '#666')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0s')))
      .selectAll('text')
      .style('font-size', isMobile ? '10px' : '12px')
      .style('fill', '#666');

    // Add axis labels with responsive positioning
    if (xAxisLabel) {
      svg
        .append('text')
        .attr('x', responsiveMargin.left + innerWidth / 2)
        .attr('y', actualHeight - (isMobile ? 25 : 35))
        .attr('text-anchor', 'middle')
        .style('font-size', isMobile ? '12px' : '14px')
        .style('fill', '#666')
        .text(xAxisLabel);
    }

    if (yAxisLabel) {
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(responsiveMargin.top + innerHeight / 2))
        .attr('y', isMobile ? 15 : 20)
        .attr('text-anchor', 'middle')
        .style('font-size', isMobile ? '12px' : '14px')
        .style('fill', '#666')
        .text(yAxisLabel);
    }

    // Responsive legend positioning - fix overlapping
    if (showLegend && series.length > 0) {
      // Don't show legend if there's not enough space
      if (actualWidth < 500) {
        return; // Skip legend on small screens
      }
      
      const legendY = actualHeight - 25;
      const legendItemWidth = Math.min(140, (actualWidth - responsiveMargin.left - responsiveMargin.right) / series.length);
      const totalLegendWidth = legendItemWidth * series.length;
      const legendStartX = Math.max(responsiveMargin.left, (actualWidth - totalLegendWidth) / 2);

      const legend = svg.append('g')
        .attr('class', 'legend-container');

      series.forEach((s, i) => {
        const legendItem = legend.append('g')
          .attr('class', 'legend-item')
          .attr('transform', `translate(${legendStartX + (i * legendItemWidth)}, ${legendY})`);

        // Line indicator
        legendItem.append('line')
          .attr('x1', 0)
          .attr('x2', 15)
          .attr('y1', 0)
          .attr('y2', 0)
          .style('stroke', s.color)
          .style('stroke-width', s.strokeWidth || 2)
          .style('stroke-dasharray', s.strokeDasharray || 'none');

        // Dot indicator
        legendItem.append('circle')
          .attr('cx', 7.5)
          .attr('cy', 0)
          .attr('r', 2.5)
          .style('fill', s.color);

        // Text label - truncate if needed
        const maxTextWidth = legendItemWidth - 25;
        legendItem.append('text')
          .attr('x', 20)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .style('font-size', '10px')
          .style('fill', '#333')
          .style('font-weight', '500')
          .text(s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name);
      });
    }

  }, [data, series, xKey, yKey, dimensions, margin, title, xAxisLabel, yAxisLabel, showGrid, showLegend, showDots]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <div className="bg-white rounded-lg overflow-hidden h-full">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  );
};

export default LineChart;