async function draw() {
    // Data
    const dataset = await d3.csv('data.csv');

    console.log('dataset', dataset);

    const parseDate = d3.timeParse('%Y-%m-%d');

    const xAccessor = d => parseDate(d.date);
    const yAccessor = d => parseInt(d.close);

    // Dimensions
    let dimensions = {
        width: 1000,
        height: 500,
        margins: 50,
    };

    dimensions.containerWidth = dimensions.width - (dimensions.margins * 2);
    dimensions.containerHeight = dimensions.height - (dimensions.margins * 2);

    // Draw Image
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);

    const tooltip = d3.select('#tooltip');
    const tooltipDot = container.append('circle')
        .attr('r', 5)
        .attr('fill', '#fc8781')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .style('pointer-events', 'none');

    // Scales
    // const xScale = d3.scaleTime()
    const xScale = d3.scaleUtc()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.containerWidth]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.containerHeight, 0])
        .nice();
    
    // console.log(xScale(xAccessor(dataset[0])), dataset[0])
    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    // console.log(lineGenerator(dataset));

    container.append('path')
        .datum(dataset)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', '#30455e');
        // .on('touchmouse mousemove', function(event) {
        //     const mousePosition = d3.pointer(event, this);
        //     console.log('mousePosition', mousePosition)
        // })
        // .on('mouseleave', function(event) {

        // });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => `$ ${d}`);

    const xAxisGroup = container.append('g')
        // .attr('transform', `translate(0, ${dimensions.containerHeight})`);
        .style('transform', `translateY(${dimensions.containerHeight}px)`);

    const yAxisGroup = container.append('g');
    
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Tooltip
    container.append('rect')
        .attr('width', dimensions.containerWidth)
        .attr('height', dimensions.containerHeight)
        .style('opacity', 0)
        .on('touchmouse mousemove', function(event) {
            const mousePosition = d3.pointer(event, this);
            // console.log('mousePosition', mousePosition);
            const date = xScale.invert(mousePosition[0]);
            // console.log(date);
            // const index = d3.bisect(dataset, date);
            // console.log(index);

            // Custom bisector - left, center, right
            const bisector = d3.bisector(xAccessor).left;
            const index = bisector(dataset, date);
            // console.log(index);

            const stock = dataset[index - 1];

            // console.log(stock);

            // Update Image
            tooltipDot.style('opacity', 1)
                .attr('cx', xScale(xAccessor(stock)))
                .attr('cy', yScale(yAccessor(stock)))
                .raise();

            tooltip.style('display', 'block')
                .style('top', `${yScale(yAccessor(stock)) - 20}px`)
                .style('left', `${xScale(xAccessor(stock))}px`);
            
            tooltip.select('.price')
                .text(`$ ${yAccessor(stock)}`);

            const dateFormatter = d3.timeFormat('%B %-d, %Y')
            tooltip.select('.date')
                .text(`${dateFormatter(xAccessor(stock))}`);
        })
        .on('mouseleave', function(event) {
            tooltipDot.style('opacity', 0);
            tooltip.style('display', 'none');
        });
    
}

draw();