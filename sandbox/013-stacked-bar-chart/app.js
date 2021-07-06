async function draw() {
    // Data
    const dataset = await d3.csv('data.csv', (d, index, columns) => {
        d3.autoType(d);
        d.total = d3.sum(columns, c => d[c])
        // console.log('d', d, 'columns', columns, d.total);
        return d;
    });

    dataset.sort((a, b) => b.total - a.total);

    // console.log('dataset', dataset);

    // Dimension
    let dimensions = {
        width: 1000,
        height: 600,
        margins: 20,
    };

    dimensions.containerWidth = dimensions.width - (dimensions.margins * 2);
    dimensions.containerHeight = dimensions.height - (dimensions.margins * 2);

    // Draw Image
    const svg = d3.select("#chart")
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
    
    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);

    // Scales
    console.log('dataset.columns.slice(1)', dataset.columns.slice(1));
    const stackGenerator = d3.stack()
        .keys(dataset.columns.slice(1));
    const stackData = stackGenerator(dataset).map(ageGroup => {
        ageGroup.forEach(state => {
            state.key = ageGroup.key
        });
        return ageGroup;
    });

    console.log('stackData', stackData);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackData, (ag) => {
            return d3.max(ag, state => state[1])
        })])
        .rangeRound([dimensions.containerHeight, dimensions.margins]);
    
    const xScale = d3.scaleBand()
        .domain(dataset.map(state => state.name))
        .range([dimensions.margins, dimensions.containerWidth])
        // .paddingInner(0.1)
        // .paddingOuter(0.1)
        .padding(0.1);

    const colorScale = d3.scaleOrdinal()
        .domain(stackData.map(d => d.key))
        .range(d3.schemeSpectral[stackData.length])
        .unknown('#ccc');

    // Axis
    const xAxisGroup = container.append('g')
        .style('transform', `translateY(${dimensions.containerHeight}px)`);
    const xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0);
    xAxisGroup.call(xAxis);

    const yAxisGroup = container.append('g')
        .attr('transform', `translate(${dimensions.margins}, 0)`);
    const yAxis = d3.axisLeft(yScale)
        .ticks(null, 's');
    yAxisGroup.call(yAxis);

    // Draw Bars
    const ageGroups = container.append('g')
        .classed('age-groups', true)
        .selectAll('g')
        .data(stackData)
        .join('g')
        .attr('fill', d => colorScale(d.key));
    
    ageGroups.selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => xScale(d.data.name))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d[0]) - yScale(d[1]));
        

        
}

draw();