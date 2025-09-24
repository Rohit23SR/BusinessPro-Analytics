import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  onHover?: (data: PieChartData | null) => void;
  onClick?: (data: PieChartData) => void;
  className?: string;
}

const PieChart = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 0,
  outerRadius,
  colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  showLabels = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  onHover,
  onClick,
  className = ''
}: PieChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRendered = useRef<boolean>(false);

  const radius = outerRadius || Math.min(width, height) / 2 - 30; // More padding
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    // Reset chart when data changes
    chartRendered.current = false;
    
    // Clear container
    d3.select(containerRef.current).selectAll("*").remove();

    // Create responsive container
    const container = d3.select(containerRef.current);
    
    // Create SVG with responsive viewBox
    const svg = container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('max-width', `${width}px`)
      .style('max-height', `${height}px`);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create tooltip with better styling
    let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
    if (showTooltip) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'pie-chart-tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('border', '1px solid #e5e7eb')
        .style('border-radius', '8px')
        .style('box-shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')
        .style('padding', '12px')
        .style('pointer-events', 'none')
        .style('opacity', '0')
        .style('font-size', '12px')
        .style('z-index', '1000')
        .style('transition', 'opacity 0.2s')
        .style('max-width', '200px');
    }

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(colors);

    // Pie generator
    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null);

    // Arc generator with better sizing for mobile
    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(2); // Rounded corners

    // Arc generator for labels - better positioning
    const labelArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius + 15)
      .outerRadius(radius + 15);

    // Generate pie data
    const pieData = pie(data);

    // Draw arcs
    const arcs = g.selectAll(".arc")
      .data(pieData)
      .enter().append("g")
      .attr("class", "arc");

    // Add paths with hover effects
    const paths = arcs.append("path")
      .attr("fill", d => d.data.color || colorScale(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", onClick ? "pointer" : "default")
      .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))");

    // Enhanced animation
    if (animate) {
      paths
        .each(function() {
          (this as any)._current = { startAngle: 0, endAngle: 0 };
        })
        .attr("d", function() {
          return arc({ startAngle: 0, endAngle: 0 } as any) || "";
        })
        .transition()
        .duration(1200)
        .delay((d, i) => i * 200)
        .ease(d3.easeBackOut)
        .attrTween("d", function(d) {
          const interpolateStart = d3.interpolate(0, d.startAngle);
          const interpolateEnd = d3.interpolate(0, d.endAngle);
          
          return function(t) {
            const current = {
              startAngle: interpolateStart(t),
              endAngle: interpolateEnd(t),
              data: d.data
            };
            return arc(current as any) || "";
          };
        });
    } else {
      paths.attr("d", arc as any);
    }

    // Enhanced labels with better positioning
    if (showLabels) {
      const labels = arcs.append("text")
        .attr("transform", d => {
          const centroid = labelArc.centroid(d);
          const angle = (d.startAngle + d.endAngle) / 2;
          const radius = Math.min(width, height) / 2;
          
          // Adjust label position for better readability
          if (radius < 120) {
            return `translate(${centroid[0] * 0.8}, ${centroid[1] * 0.8})`;
          }
          return `translate(${centroid})`;
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", d => {
          const angle = (d.startAngle + d.endAngle) / 2;
          return angle > Math.PI ? "end" : "start";
        })
        .style("font-size", Math.min(width, height) < 200 ? "10px" : "12px")
        .style("font-weight", "500")
        .style("fill", "#374151")
        .style("opacity", 0)
        .style("pointer-events", "none");

      if (animate) {
        labels
          .transition()
          .delay((d, i) => (i * 200) + 1400)
          .duration(600)
          .style("opacity", 1)
          .text(d => {
            const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
            if (percentage > 8) {
              return Math.min(width, height) < 200 ? `${percentage.toFixed(0)}%` : `${percentage.toFixed(0)}%`;
            }
            return '';
          });
      } else {
        labels
          .style("opacity", 1)
          .text(d => {
            const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
            return percentage > 8 ? `${percentage.toFixed(0)}%` : '';
          });
      }
    }

    // Enhanced interactions
    paths
      .on("mouseenter", function(event, d) {
        // Animate this specific path
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", () => {
            const [x, y] = arc.centroid(d);
            const scale = 0.08;
            return `translate(${x * scale}, ${y * scale})`;
          })
          .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.15))");

        // Call external hover handler if provided
        if (onHover) {
          onHover(d.data);
        }

        // Show tooltip with better formatting
        if (tooltip) {
          tooltip
            .style("opacity", 1)
            .html(`
              <div style="font-weight: 600; color: #111827; margin-bottom: 6px; font-size: 14px;">${d.data.name}</div>
              <div style="color: #6b7280; margin-bottom: 2px;">Value: <span style="font-weight: 500;">${d3.format(",")(d.data.value)}</span></div>
              <div style="color: #6b7280;">Percentage: <span style="font-weight: 500;">${((d.data.value / total) * 100).toFixed(1)}%</span></div>
            `)
            .style("left", (event.pageX + 12) + "px")
            .style("top", (event.pageY - 12) + "px");
        }
      })
      .on("mouseleave", function() {
        // Reset this specific path
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "translate(0,0)")
          .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))");

        // Call external hover handler
        if (onHover) {
          onHover(null);
        }

        // Hide tooltip
        if (tooltip) {
          tooltip.style("opacity", 0);
        }
      })
      .on("mousemove", function(event) {
        // Update tooltip position
        if (tooltip) {
          tooltip
            .style("left", (event.pageX + 12) + "px")
            .style("top", (event.pageY - 12) + "px");
        }
      })
      .on("click", function(event, d) {
        if (onClick) {
          onClick(d.data);
        }
      });

    // Cleanup function
    return () => {
      if (tooltip) {
        tooltip.remove();
      }
    };
  }, [data, width, height, innerRadius, radius, colors, showLabels, animate]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center"
        style={{ minHeight: `${height}px` }}
      />

      {showLegend && (
        <div className="mt-3">
          <div className="space-y-2 text-sm">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color || colors[index % colors.length] }}
                  />
                  <span className="text-gray-700 font-medium truncate text-xs">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-right flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-xs">
                    {item.value}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({((item.value / total) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerRadius > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {d3.format(",")(total)}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;