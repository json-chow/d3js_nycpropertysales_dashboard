import { useEffect, useRef } from "react"
import * as d3 from "d3";

export default function Scatter({dataX, dataY, width, height}) {
    const svgRef = useRef();

    useEffect(() => {
        if (dataX.length === 0 || dataY.length === 0) {
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

        let x;
        if (dataX.type === "cat") {
            let categories = dataX.map(d => d.category)
            x = d3.scaleBand()
                .domain(categories)
                .range([0, wt])
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
        } else {
            x = d3.scaleLinear()
                .domain([0, d3.max(dataX)])
                .range([0, wt])
            svg.append("g")
                .attr("transform", `translate(0, ${ht})`)
                .call(d3.axisBottom(x))
        }

        let y;
        if (dataY.type === "cat") {
            let categories = dataY.map(d => d.category)
            y = d3.scaleBand()
                .domain(dataY.map(d => d.category))
                .range([ht, 0])
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
        } else {
            y = d3.scaleLinear()
                .domain([0, d3.max(dataY)])
                .range([ht, 0])
            svg.append("g")
                .call(d3.axisLeft(y))
        }
        const data = dataX.raw.map((x, i) => ({x, y: dataY.raw[i]}))
        const xLoc = function(d) {
            if (dataX.type === 'cat') {
                return Math.max(Math.min(x(d.x) + (x.bandwidth ? x.bandwidth() / 2 : 0), x.range()[1]) + (Math.random() * 5 - 5 / 2), x.range()[0])
            } else {
                return Math.max(Math.min(x(d.x) + (x.bandwidth ? x.bandwidth() / 2 : 0), x.range()[1]), x.range()[0])
            }
        }
        const yLoc = function(d) {
            if (dataX.type === 'cat') {
                return Math.min(Math.max(y(d.y) + (y.bandwidth ? y.bandwidth() / 2 : 0), y.range()[1]) + (Math.random() * 5 - 5 / 2), y.range()[0])
            } else {
                return Math.min(Math.max(y(d.y) + (y.bandwidth ? y.bandwidth() / 2 : 0), y.range()[1]), y.range()[0])
            }
        }
        svg.append("g")
            .selectAll("dot")
            .data(data)
            .join("circle")
                .attr("cx", d => xLoc(d))
                .attr("cy", d => yLoc(d))
                .attr("r", 3.5)
                .style("fill", "#69b3a2")

        // x-axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", wt / 2)
            .attr("y", ht + margin.top + 30)
            .text(dataX.title);

        // y-axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 25)
            .attr("x", -ht / 2 + margin.top)
            .text(dataY.title);

        // title
        svg.append("text")
            .attr("x", wt / 2)
            .attr("y", -margin.top / 3)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text(`${dataX.title} vs. ${dataY.title}`);

    }, [dataX, dataY, width, height])

    return (
        <>
            {
                function() {
                    if (!dataX.length && !dataY.length) {
                        return <div>Choose variables for the x and y axes</div>
                    } else if (!dataX.length) {
                        return <div>Choose a variable for the x-axis</div>
                    } else if (!dataY.length) {
                        return <div>Choose a variable for the y-axis</div>
                    } else {
                        return <svg ref={svgRef}></svg>
                    }
                }()
            }
        </>
    )
}