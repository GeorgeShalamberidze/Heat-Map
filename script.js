// Global Variables
const canvasWidth = 1060;
const canvasHeight = 540;

const colorTemp = [
    { per: "0%", color: "#2c7bb6" },
    { per: "12.5%", color: "#00a6ca" },
    { per: "25%", color: "#00ccbc" },
    { per: "37.5%", color: "#90eb9d" },
    { per: "50%", color: "#ffff8c" },
    { per: "62.5%", color: "#f9d057" },
    { per: "75%", color: "#f29e2e" },
    { per: "87.5%", color: "#e76818" },
    { per: "100%", color: "#d7191c" }
]

const colors = [
    "#2c7bb6",
    "#00a6ca",
    "#00ccbc",
    "#90eb9d",
    "#ffff8c",
    "#f9d057",
    "#f29e2e",
    "#e76818",
    "#d7191c",
]

var parseTime = d3.timeFormat('%B')
const tooltip = d3.select('.scatter-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(data => {

        const years = data.monthlyVariance.map(data => data.year)
        const mainData = data.monthlyVariance
        const colorScale = d3.scaleLinear()
            .domain([
                d3.min(mainData, d => d.variance),
                d3.max(mainData, d => d.variance)
            ])
            .range([0, 9])
        const rectHeight = (canvasHeight) / 12
        console.log(rectHeight)
        // SCALES X - Y
        const xScale = d3.scaleTime()
            .domain([
                d3.min(mainData, d => d.year),
                d3.max(mainData, d => d.year)
            ])
            .range([10, canvasWidth + 140])

        const yScale = d3.scaleLinear()
            .domain([0, 11])
            .range([30, canvasHeight])

        // X - Y Axeseseses
        const xAxis = d3
            .axisBottom(xScale)
            .tickFormat(d3.format('d'))

        const yAxis = d3
            .axisLeft(yScale)
            .tickFormat((month) => {
                const d = new Date(0)
                d.setUTCMonth(month)
                return d3.timeFormat('%B')(d)
            })

        // Creating SVG
        const svg = d3.select('#svg')
            .attr('id', 'main')
            .attr('width', canvasWidth + 280)
            .attr('height', canvasHeight + 50)
            .attr('transform', `scale(${0.8})`)

        // Calling X - Y Axes
        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(${110}, ${canvasHeight + 20})`)
            .attr('id', 'x-axis')

        svg.append('g')
            .call(yAxis)
            .attr('transform', `translate(${120}, ${-5})`)
            .attr('id', 'y-axis')

        // Adding Rectangles
        svg.append('g')
            .selectAll('rect')
            .data(mainData)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', (d) => xScale(d.year))
            .attr('y', (d) => yScale(d.month) - 1)
            .attr('width', 3)
            .attr('height', rectHeight)
            .attr('transform', `translate(${112}, ${-70})`)
            .attr('data-month', (d) => d.month - 1)
            .attr('data-year', (d) => d.year)
            .attr('data-temp', (d) => d.variance)
            .attr('fill', (d) => {
                return colors[Math.floor(colorScale(d.variance))]
            })
            .on('mouseover', (d, i) => {
                var monthDate = new Date(i.year, i.month)

                tooltip.style("opacity", 1)
                    .html(
                        d3.timeFormat('%Y - %B')(monthDate - 1)
                        + "<br>"
                        + (i.variance.toFixed(1)) + "&#8451;"
                    )
                    .attr('data-year', i.year)

                onmousemove = function (e) {
                    tooltip
                        .style("left", `${e.clientX - 45}px`)
                        .style("top", `${e.clientY - 90}px`)
                }
            })
            .on('mouseout', (d, i) => {
                tooltip
                    .style('opacity', 0)
            })

        d3.selectAll('.tick text')
            .attr('font-size', 20)


        // LEGEND STUFF
        const legendWidth = 200
        const legendHeight = 50

        const legend = d3.select('#legend')
            .append('svg')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('id', 'legend-svg')
            .selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * (legendWidth / colors.length))
            .attr('y', 0)
            .attr('width', legendWidth / colors.length)
            .attr('height', legendHeight)
            .attr('fill', (d) => d)
    })
