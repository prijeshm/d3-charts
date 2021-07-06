async function draw() {
    // Data
    const dataset = await d3.json('data.json');
    // const xAccessor = d => d.currently.humidity;
    // const yAccessor = d => d.length;
    // Dimensions
    let dimensions = {
        width: 800,
        height: 400,
        margins: 50
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    // Draw SVG
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);

    // // Scales
    // const xScale = d3.scaleLinear()
    //     .domain(d3.extent(dataset, xAccessor))
    //     .range([0, dimensions.containerWidth])
    //     .nice();

    // const bin = d3.bin()
    //     .domain(xScale.domain())
    //     .value(xAccessor)
    //     .thresholds(10);

    // const binnedDataset = bin(dataset);
    // const padding = 1;

    // const yScale = d3.scaleLinear()
    //     .domain([0, d3.max(binnedDataset, yAccessor)])
    //     .range([dimensions.containerHeight, 0])
    //     .nice();

    // console.log('dataset', dataset, 'binnedDataset', binnedDataset)

    // Draw Bars
    // const barsGroup = container.selectAll('rect')
    //     .data(dataset)
    //     .join('rect')
    //     .attr('width', 5)
    //     .attr('height', 100)
    //     .attr('x', d => xScale(xAccessor(d)))
    //     .attr('y', 0)
    // const barsGroup = container.selectAll('rect')
    //     .data(binnedDataset)
    //     .join('rect')
    //     .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0)]) - padding)
    //     .attr('height', d => dimensions.containerHeight - yScale(yAccessor(d)))
    //     .attr('x', d => xScale(d.x0))
    //     .attr('y', d => yScale(yAccessor(d)))
    //     .attr('fill', '#01c5c4');

    // container.append('g')
    //     .classed('bar-labels', true)
    //     .selectAll('text')
    //     .data(binnedDataset)
    //     .join('text')
    //     .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    //     .attr('y', d => yScale(yAccessor(d)) - 10)
    //     .text(yAccessor);

    // // Draw Axis
    // const xAxis = d3.axisBottom(xScale);

    // const xAxisGroup = container.append('g')
    //     .style('transform', `translateY(${dimensions.containerHeight}px)`);

    // xAxisGroup.call(xAxis);

    const labelsGroup = container.append('g')
        .classed('bar-labels', true);

    const xAxisGroup = container.append('g')
        .style('transform', `translateY(${dimensions.containerHeight}px)`);

    const meanLine = container.append('line')
        .classed('mean-line', true)

    const histogram = metric => {
        const xAccessor = d => d.currently[metric];
        const yAccessor = d => d.length;

        // Scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.containerWidth])
            .nice();

        const bin = d3.bin()
            .domain(xScale.domain())
            .value(xAccessor)
            .thresholds(10);

        const binnedDataset = bin(dataset);
        const padding = 1;

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(binnedDataset, yAccessor)])
            .range([dimensions.containerHeight, 0])
            .nice();

        const exitTransition = d3.transition().duration(500);
        const updateTransition = d3.transition(exitTransition).duration(500);
        // Draw Bars
        container.selectAll('rect')
            .data(binnedDataset)
            .join(
                (enter) => enter.append('rect')
                    .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0)]) - padding)
                    .attr('height', 0)
                    .attr('x', d => xScale(d.x0))
                    .attr('y', dimensions.containerHeight)
                    .attr('fill', '#b8de6f'),
                (update) => update,
                (exit) => exit.attr('fill', '#f29233')
                    .transition(exitTransition)
                    .attr('y', dimensions.containerHeight)
                    .attr('height', 0)
                    .remove()
            )
            .transition(updateTransition)
            .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0)]) - padding)
            .attr('height', d => dimensions.containerHeight - yScale(yAccessor(d)))
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(yAccessor(d)))
            .attr('fill', '#01c5c4');
    
        
        labelsGroup.selectAll('text')
            .data(binnedDataset)
            // .join('text')
            .join(
                enter => enter.append('text')
                    .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
                    .attr('y', dimensions.containerHeight)
                    .text(yAccessor),
                update => update,
                exit => exit.transition(exitTransition)
                    .attr('y', dimensions.containerHeight)
                    .remove()
            )
            .transition(updateTransition)
            .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            .attr('y', d => yScale(yAccessor(d)) - 10)
            .text(yAccessor);
    
        const mean = d3.mean(dataset, xAccessor);

        meanLine.raise()
            .transition(updateTransition)
            .attr('x1', xScale(mean))
            .attr('y1', 0)
            .attr('x2', xScale(mean))
            .attr('y2', dimensions.containerHeight)

        // Draw Axis
        const xAxis = d3.axisBottom(xScale);
    
        xAxisGroup.transition()
            .call(xAxis);
    }

    d3.select('#metric')
        .on('change', function(e) {
            e.preventDefault();
            histogram(this.value);
        });

    histogram('humidity');
}

draw();