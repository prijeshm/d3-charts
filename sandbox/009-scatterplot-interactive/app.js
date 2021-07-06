async function draw() {
    // Get data
    const dataset = await d3.json("data.json");
    const xAccessor = d => d.currently.humidity;
    const yAccessor = d => d.currently.apparentTemperature;

    // Dimensions
    let dimensions = {
        width: 800,
        height: 800,
        margin: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        }
    };

    dimensions.containerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.containerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    // Draw chart container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const container = svg.append("g")
        .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

    const tooltip = d3.select('#tooltip');

    function showTooltip(event, datum) {
        console.log('event', event, 'datum', datum);
        d3.select(this)
            .attr('fill', '#120078')
            .attr('r', 8);
        tooltip.style('display', 'block')
            .style('top', yScale(yAccessor(datum)) - 25 + 'px')
            .style('left', xScale(xAccessor(datum)) +'px');

        const formatter = d3.format('.2f');
        const dateFormatter = d3.timeFormat('%B %-d, %Y');

        tooltip.select('.metric-date')
            .text(dateFormatter(datum.currently.time * 1000))
        tooltip.select('.metric-humidity span')
            .text(formatter(xAccessor(datum)));
        tooltip.select('.metric-temperature span')
            .text(formatter(yAccessor(datum)));
    }

    function hideToolTip(event) {
        d3.select(this)
            .attr('fill', 'red')
            .attr('r', 5);
        tooltip.style('display', 'none');
    }

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        // .range([0, dimensions.containerWidth]);
        .rangeRound([0, dimensions.containerWidth])
        .clamp(true);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        // .range([0, dimensions.containerHeight])
        .rangeRound([dimensions.containerHeight, 0])
        .nice()
        .clamp(true);
    
    // Draw circles
    container.selectAll('circle')
        .data(dataset)
        // .join(
        //     enter => enter.append("circle"),
        //     update => update,
        //     exit => exit.remove()
        // )
        .join("circle")
            .attr("r", 5)
            .attr("fill", "red")
            // .attr("cx", xAccessor)
            .attr("cx", d => xScale(xAccessor(d)))
            // .attr("cy", yAccessor)
            .attr("cy", d=> yScale(yAccessor(d)))
            .on('mouseover', showTooltip)
            .on('mouseleave', hideToolTip);
    
    // Axis
    // const xAxis = d3.axisBottom()
    //     .scale(xScale);

    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        // .tickValues([0.4, 0.5, 0.8])
        .tickFormat((d) => d * 100 + '%')

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.containerHeight}px)`)
        .classed('axis', true);
    
    xAxisGroup.append('text')
        .attr('x', dimensions.containerWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .text('Humidity');

    const yAxis = d3.axisLeft(yScale);

    const yAxisGroup = container.append('g')
        .call(yAxis)
        .classed('axis', true);

    yAxisGroup.append('text')
        .attr('x', -dimensions.containerHeight / 2)
        .attr('y', -dimensions.margin.left + 15)
        .attr('fill', 'black')
        .html('Temperature &deg; F')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle');
    
}

draw();