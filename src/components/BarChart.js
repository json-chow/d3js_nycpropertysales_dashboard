import { useEffect, useRef } from "react"
import * as d3 from "d3";

export default function BarChart({data, width, height, title, flip}) {
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

        let categories = data.map(d => d.category)
        if (!flip) {
            
            const x = d3.scaleBand()
                .range([0, wt])
                .domain(categories)
                .padding(0.1);
            let xTicks = [];
            if (categories.length > 25) {
                for (let i = 0; i < categories.length; i += Math.ceil(categories.length / 25)) {
                    if (categories[i].length > 12) {
                        i -= 1
                    } else {
                        xTicks.push(categories[i])
                    }
                }
            } else {
                xTicks = categories
            }
            const xAxis = svg.append("g")
                .attr("transform", `translate(0, ${ht})`)
                .call(d3.axisBottom(x).tickValues(xTicks))

            xAxis.selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-20)")

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([ht, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                    .attr("x", d => x(d.category))
                    .attr("y", d => y(d.value))
                    .attr("width", x.bandwidth())
                    .attr("height", d => ht - y(d.value))
                    .attr("fill", "#69b3a2")

            // x-axis label
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", wt / 2)
                .attr("y", ht + margin.top + 30)
                .text("Category");

            // y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 35)
                .attr("x", -ht / 2 + margin.top)
                .text("Count");
        } else {
            const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, wt]);
            svg.append("g")
                .attr("transform", `translate(0, ${ht})`)
                .call(d3.axisBottom(x));

            const y = d3.scaleBand()
                .range([0, ht])
                .domain(categories)
                .padding(0.1);
            let yTicks = [];
            if (categories.length > 25) {
                for (let i = 0; i < categories.length; i += Math.ceil(categories.length / 25)) {
                    if (categories[i].length > 12) {
                        i -= 1
                    } else {
                        yTicks.push(categories[i])
                    }
                }
            } else {
                yTicks = categories
            }
            const yAxis = svg.append("g")
                            .call(d3.axisLeft(y).tickValues(yTicks))
            
            yAxis.selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", ".3em")
                .attr("dy", "1em")
                .attr("transform", "rotate(45)")

            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                    .attr("x", x(0))
                    .attr("y", d => y(d.category))
                    .attr("width", d => x(d.value))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#69b3a2")

            // x-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", wt / 2)
                .attr("y", ht + margin.top + 30)
                .text("Count");

            // y-axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 25)
                .attr("x", -ht / 2 + margin.top)
                .text("Category");
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