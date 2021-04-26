function drawVerticalBarChart() {
    const chartContainer = d3.select(".vertical-chart-container");
    const height = 300,
        width = 400;
    
    const margin = { top: 20, right: 20, bottom: 35, left: 35 };
    
    const svg = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#f4f4f4");
    
    d3.json("data/bar.json").then(data => {
        const colorScale = d3.scaleOrdinal()
            .domain([0, d3.max(data, d => d.value)])
            .range(d3.schemeCategory10);
    
            console.log('d3.schemeSet1', d3.schemeSet1)
    
        const x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .padding(0.2);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height - margin.bottom, margin.top]);
    
        const xAxis = g =>
            g.attr("transform", `translate(0, ${ height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));
    
        const yAxis = g =>
            g.attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));
    
        const bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", (d, i) => x(i))
                .attr("y", (d, i) => y(0))
                .attr("height", d => 0)
                .attr("width", x.bandwidth())
                .attr("rx", 2)
                .attr("fill", d => colorScale(d.value))
                .transition()
                    .duration(500)
                    .attr("y", (d, i) => y(d.value))
                    .attr("height", d => y(0) - y(d.value))
                    .delay((d, i) => i * 50)
                    .ease(d3.easeLinear);
            
        svg.append("g").call(xAxis)
            .selectAll("text")
                .attr("x", 9)
                .attr("y", 0)
                .attr("transform", "rotate(-90)")
                .attr("dy", ".35em")
                .style("text-anchor", "start");
        svg.append("g").call(yAxis)
    });
}

drawVerticalBarChart();

function drawHorizontalBarChart() {
    const chartContainer = d3.select(".horizontal-chart-container");
    const height = 300,
        width = 400;
    
    const margin = { top: 20, right: 20, bottom: 35, left: 35 };
    
    const svg = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#f4f4f4");
    
    d3.json("data/bar.json").then(data => {
        const colorScale = d3.scaleOrdinal()
            .domain([0, d3.max(data, d => d.value)])
            .range(d3.schemeCategory10);
    
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);
    
        const xAxis = g =>
            g.attr("transform", `translate(0, ${margin.top})`)
            .call(d3.axisTop(x).tickSizeOuter(0));
    
        const yAxis = g =>
            g.attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).tickFormat(i => data[i].name));
    
        const bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", (d, i) => x(0))
                .attr("y", (d, i) => y(i))
                .attr("height", y.bandwidth())
                .attr("width", d => 0)
                .attr("rx", 2)
                .attr("fill", d => colorScale(d.value))
                .transition()
                    .duration(500)
                    .attr("width", d => x(d.value) - x(0))
                    .delay((d, i) => i * 50)
                    .ease(d3.easeLinear);
            
        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);
    });
}

drawHorizontalBarChart();
