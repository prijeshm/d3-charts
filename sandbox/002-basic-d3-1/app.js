// const pBrowser = document.querySelector('p');
// const pD3 = d3.select('p');
// const pAllD3 = d3.selectAll('p');

// console.log('pBrowser', pBrowser);
// console.log('pD3', pD3);
// console.log('pAllD3', pAllD3);

const body = d3.select('body');
const p = body.append('p')
    // .attr("class", "foo")
    // .attr("class", "bar")
    .classed("foo", true)
    .classed("bar", true)
    .text("Hello from D3 P")
    .style("color", "blue");

console.log('body', body);
console.log('p', p);