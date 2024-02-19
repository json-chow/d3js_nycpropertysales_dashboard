import { useEffect, useRef } from "react"
import * as d3 from "d3";

export default function Histogram({data, width, height, title, flip}) {
    const svgRef = useRef();

    useEffect(() => {
        if (data.length === 0) {
            return
        }

        const margin = { top: 40, right: 20, bottom: 80, left: 100 },
            wt = width - margin.left - margin.right,
            ht = height - margin.top - margin.bottom

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

        if (!flip) {
            console.log(d3.max(data.map(Number)))
            const x = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, wt])
            svg.append("g")
                .attr("transform", `translate(0, ${ht})`)
                .call(d3.axisBottom(x));

            const histogram = d3.bin()
                .value(d => d)
                .domain(x.domain())
                .thresholds(x.ticks(12))

            const bins = histogram(data);

            const y = d3.scaleLinear()
                .range([ht, 0])
                .domain([0, d3.max(bins, d => d.length)])
            svg.append("g")
                .call(d3.axisLeft(y))

            svg.selectAll("rect")
                .data(bins)
                .join("rect")
                    .attr("x", d => x(d.x0) + 1)
                    .attr("y", d => y(d.length))
                    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
                    .attr("height", d => ht - y(d.length))
                    .style("fill", "#69b3a2");

            // x-axis label
            svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", wt / 2)
            .attr("y", ht + margin.top + 30)
            .text("Value");

            // y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 25)
                .attr("x", -ht / 2 + margin.top)
                .text("Count");
        } else {
            const y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, ht])
            svg.append("g")
                .call(d3.axisLeft(y))

            const histogram = d3.bin()
                .value(d => d)
                .domain(y.domain())
                .thresholds(y.ticks(10))

            const bins = histogram(data);

            const x = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length)])
                .range([0, wt])
            svg.append("g")
                .attr("transform", `translate(0, ${ht})`)
                .call(d3.axisBottom(x))

            svg.selectAll("rect")
                .data(bins)
                .join("rect")
                    .attr("y", d => y(d.x0))
                    .attr("x", 1)
                    .attr("height", d => y(d.x1) - y(d.x0))
                    .attr("width", d => x(d.length))
                    .style("fill", "#69b3a2");

            // x-axis label
            svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", wt / 2 + margin.left)
            .attr("y", ht + margin.top + 30)
            .text("Count");

            // y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 25)
                .attr("x", -ht / 2 + margin.top)
                .text("Value");
        }

        // title
        svg.append("text")
            .attr("x", wt / 2)
            .attr("y", -margin.top / 3)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text(title);
    }, [data, width, height, title, flip])

    return (
        <>
            {data.length ? <svg ref={svgRef}></svg> : "Select a variable"}
        </>
    )
}