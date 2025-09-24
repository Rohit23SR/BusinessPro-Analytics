import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatMapData {
  x: string | number;
  y: string | number;
  value: number;
}

interface HeatMapProps {
  data: HeatMapData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  title?: string;
  colorScheme?: string[];
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 50, right: 120, bottom: 80, left: 120 },
  title = "Heat Map",
  colorScheme = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log('HeatMap: No data provided');
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    console.log('HeatMap dimensions:', { width, height, innerWidth, innerHeight });

    // Get unique x and y values with simpler, more reliable sorting
    const xValues = Array.from(new Set(data.map(d => String(d.x))));
    const yValues = Array.from(new Set(data.map(d => String(d.y))));
    
    // Simple sorting logic
    if (xValues.length > 0 && !isNaN(Number(xValues[0]))) {
      // If x values are numeric (hours), sort numerically
      xValues.sort((a, b) => Number(a) - Number(b));
    } else {
      // For daily view, use predefined order
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      xValues.sort((a, b) => {
        const aIndex = dayOrder.indexOf(a);
        const bIndex = dayOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }
    
    // Sort y values
    if (yValues.some(y => y.includes('Week'))) {
      // For weekly data, sort naturally
      yValues.sort();
    } else {
      // For daily data, use day order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      yValues.sort((a, b) => {
        const aIndex = dayOrder.indexOf(a);
        const bIndex = dayOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    console.log('HeatMap data points:', data.length);
    console.log('X values:', xValues);
    console.log('Y values:', yValues);

    // Create scales with proper spacing
    const xScale = d3.scaleBand()
      .domain(xValues.map(String))
      .range([0, innerWidth])
      .padding(0.02);

    const yScale = d3.scaleBand()
      .domain(yValues)
      .range([0, innerHeight])
      .padding(0.02);

    // Better color scale with more contrast
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, 100]); // Fixed domain for consistency

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title back with proper positioning
    if (title) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text(title);
    }

    // Remove debug border
    // svg
    //   .append('rect')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('fill', 'none')
    //   .style('stroke', '#ddd')
    //   .style('stroke-width', '1px');

    // Create cells with better styling
    g.selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(String(d.x)) || 0)
      .attr('y', d => yScale(String(d.y)) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', d => colorScale(d.value))
      .style('stroke', '#ffffff')
      .style('stroke-width', '1px')
      .style('cursor', 'pointer')
      .style('rx', '2px') // Rounded corners
      .on('mouseover', function(event, d) {
        // Enhanced tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'heatmap-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.9)')
          .style('color', 'white')
          .style('padding', '10px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('font-weight', '500')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)');

        // Format display based on data type
        let xLabel, xValue;
        if (typeof d.x === 'number' || !isNaN(Number(d.x))) {
          // Hourly view - format as time
          const hour = Number(d.x);
          xLabel = 'Time';
          xValue = hour === 0 ? '12 AM' : 
                   hour < 12 ? `${hour} AM` : 
                   hour === 12 ? '12 PM' : 
                   `${hour - 12} PM`;
        } else {
          // Daily view - show day name
          xLabel = 'Day';
          xValue = d.x;
        }

        tooltip.html(`
          <div style="margin-bottom: 4px;"><strong>${d.y}</strong></div>
          <div style="margin-bottom: 4px;">${xLabel}: ${xValue}</div>
          <div>Activity: ${d.value}%</div>
        `)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 10) + 'px');

        d3.select(this)
          .style('opacity', 0.8)
          .style('stroke-width', '2px')
          .style('stroke', '#333');
      })
      .on('mouseout', function() {
        d3.selectAll('.heatmap-tooltip').remove();
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', '1px')
          .style('stroke', '#ffffff');
      });

    // Add text labels with better visibility
    g.selectAll('.cell-text')
      .data(data.filter(d => d.value > 30)) // Only show text on darker cells
      .enter()
      .append('text')
      .attr('class', 'cell-text')
      .attr('x', d => (xScale(String(d.x)) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => (yScale(String(d.y)) || 0) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)')
      .text(d => d.value);

    // Add x-axis with proper formatting for both hourly and daily views
    let xAxis;
    if (typeof xValues[0] === 'number') {
      // Hourly view - format time
      xAxis = d3.axisBottom(xScale)
        .tickFormat(d => {
          const hour = Number(d);
          if (hour % 3 === 0) { // Show every 3rd hour
            return hour === 0 ? '12 AM' : 
                   hour < 12 ? `${hour} AM` : 
                   hour === 12 ? '12 PM' : 
                   `${hour - 12} PM`;
          }
          return '';
        });
    } else {
      // Daily view - show day names
      xAxis = d3.axisBottom(xScale);
    }

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#666')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#666');

    // Add axis labels (dynamic based on data type)
    const xAxisLabel = typeof xValues[0] === 'number' ? 'Hour of Day' : 'Day of Week';
    const yAxisLabel = yValues.includes('Monday') ? 'Day of Week' : 'Week';

    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#666')
      .style('font-weight', '500')
      .text(xAxisLabel);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerHeight / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#666')
      .style('font-weight', '500')
      .text(yAxisLabel);

    // Enhanced legend with proper alignment to heatmap
    const legendWidth = 20;
    const legendHeight = Math.min(innerHeight, 180); // Match heatmap height
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 100}, ${margin.top})`);

    // Create gradient for legend
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', legendHeight)
      .attr('x2', 0).attr('y2', 0);

    // Add gradient stops
    const stops = d3.range(0, 1.1, 0.1);
    stops.forEach(stop => {
      gradient
        .append('stop')
        .attr('offset', stop)
        .attr('stop-color', colorScale(stop * 100));
    });

    // Position legend rectangle to align with heatmap grid
    legend
      .append('rect')
      .attr('y', 20) // Start below the title, aligned with heatmap
      .attr('width', legendWidth)
      .attr('height', legendHeight - 20) // Reduce height to account for title space
      .style('fill', 'url(#legend-gradient)')
      .style('stroke', '#ddd')
      .style('stroke-width', '1px');

    // Legend scale and axis - align with legend rectangle
    const legendScale = d3.scaleLinear()
      .domain([0, 100])
      .range([legendHeight - 20, 0]); // Match the rectangle height

    const legendAxis = d3.axisRight(legendScale)
      .tickSize(4)
      .ticks(6)
      .tickFormat(d => `${d}%`);

    legend
      .append('g')
      .attr('transform', `translate(${legendWidth}, 20)`) // Align with rectangle
      .call(legendAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#666');

    // Legend title with proper positioning relative to heatmap
    legend
      .append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#666')
      .style('font-weight', '500')
      .text('Activity %');

  }, [data, width, height, margin, title, colorScheme]);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default HeatMap;