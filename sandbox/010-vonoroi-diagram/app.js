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
        container.append('circle')
            .classed('dot-hovered', true)
            .attr('fill', '#120078')
            .attr('r', 8)
            .attr("cx", xScale(xAccessor(datum)))
            .attr("cy", yScale(yAccessor(datum)))
            .style('pointer-events', 'none');  
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
        container.select('.dot-hovered').remove();
        tooltip.style('display', 'none');
    }

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .rangeRound([0, dimensions.containerWidth])
        .clamp(true);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .rangeRound([dimensions.containerHeight, 0])
        .nice()
        .clamp(true);
    
    // Draw circles
    container.selectAll('circle')
        .data(dataset)
        .join("circle")
            .attr("r", 5)
            .attr("fill", "red")
            .attr("cx", d => xScale(xAccessor(d)))
            .attr("cy", d=> yScale(yAccessor(d)));
            // .on('mouseover', showTooltip)
            // .on('mouseleave', hideToolTip);

    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
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
    
    const delaunay = d3.Delaunay.from(
        dataset, 
        d => xScale(xAccessor(d)),
        d => yScale(yAccessor(d))
    );

    console.log('delaunay', delaunay);

    const voronoi = delaunay.voronoi();
    voronoi.xmax = dimensions.containerWidth;
    voronoi.ymax = dimensions.containerHeight;

    console.log('voronoi', voronoi);

    container.append('g')
        .selectAll('path')
        .data(dataset)
        .join('path')
        // .attr('stroke', 'black')
        .attr('fill', 'transparent')
        .attr('d', (d, i) => voronoi.renderCell(i))
        .on('mouseover', showTooltip)
        .on('mouseleave', hideToolTip);


}

draw();