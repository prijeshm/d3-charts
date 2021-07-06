// d3.json("data.json").then(data => {
//     console.log(data);
// });

async function getJsonData() {
    const data = await d3.json("data.json");
    console.log('JSON', data);
}

getJsonData();

async function getCsvData() {
    const data = await d3.csv("data.csv");
    console.log('CSV', data);
}

getCsvData();