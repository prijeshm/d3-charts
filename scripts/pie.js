function drawPieChart() {
    const chartContainer = d3.select(".pie-chart-container");
    const height = 300,
        width = 300,
        margin = 30;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#f4f4f4")
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    
    
    d3.json("data/pie.json").then(data => {
        const colorScale = d3.scaleOrdinal()
            .domain(data)
            .range(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d.value);

        const pieData = pie(data);
        console.log('pieData', pieData)

        svg.selectAll('whatever')
            .data(pieData)
            .enter()
            .append("path")
                .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
                .attr("fill", d => colorScale(d.data.key))
                .attr("stroke", "#f4f4f4")
                .style("stroke-width", "0.5px")
                .style("opacity", 0.7)
    });
}

drawPieChart();