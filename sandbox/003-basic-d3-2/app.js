const data = [10, 20, 30, 40, 50, 60];

// const el = d3.select("ul")
//     .selectAll("li")
//     .data(data)
//     .join('li')
//     .text(d => d)

// const el = d3.select("ul")
//     .selectAll("li")
//     .data(data)
//     .join(
//         enter => enter.append("li")
//             .style("background-color", "palegreen")
//             .style("color", "green"),
//         update => update.style("background-color", "pink")
//             .style("color", "red"),
//         exit => exit.remove()
//     )
//     .text(d => d)

// update
const el = d3.select("ul")
    .selectAll("li")
    .data(data)
    .text(d => d)
    .style("background-color", "pink")
    .style("color", "red");

// enter
el.enter()
    .append("li")
    .text(d => d)
    .style("background-color", "palegreen")
    .style("color", "green");

// exit
el.exit()
    .remove();

console.log(el)
