async function draw() {
    // Data
    const dataset = await d3.csv("data.csv");

    // Dimensions
    let dimensions = {
        width: 600,
        height: 600,
        margins: 10,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    const radius = dimensions.containerWidth / 2;

    // Draw Image
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins})`);

    // Scales
    const populationPie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const slices = populationPie(dataset);
    
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    const arcLabels = d3.arc()
        .outerRadius(radius)
        .innerRadius(200);

    // const colors = d3.quantize((t) => d3.interpolateSpectral(t), dataset.length);
    const colors = d3.quantize(d3.interpolateSpectral, dataset.length);
    const colorScale = d3.scaleOrdinal()
        .domain(dataset.map(d => d.name))
        .range(colors);

    // Draw shape
    const arcGroup = container.append('g')
        .attr('transform', `translate(${dimensions.containerHeight / 2}, ${dimensions.containerWidth / 2})`);

    arcGroup.selectAll('path')
        .data(slices)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data.name))
    
    const labelsGroup = container.append('g')
        .attr('transform', `translate(${dimensions.containerHeight / 2}, ${dimensions.containerWidth / 2})`)
        .classed('labels', true);

    labelsGroup.selectAll('text')
        .data(slices)
        .join('text')
        .attr('transform', d => `translate(${arcLabels.centroid(d)})`)
        .call(
            text => text.append('tspan')
                .style('font-weight', 'bold')
                .attr('y', -4)
                .text(d => d.data.name)
        )
        .call(
            text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
                .append('tspan')
                .attr('y', 9)
                .attr('x', 0)
                .text(d => d.data.value)
        );
}

draw();