const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")
      .then(setData);
  }, []);

  useEffect(() => {
    if (data) {
      createTreemapDiagram(data);
    }
  }, [data]);

  return (
    <div id="root">
      <h1 id="title">Kickstarter Pledges</h1>
      <p id="description">A tree map of Kickstarter projects categorized by goal amount.</p>
      <div id="treemap"></div>
      <div id="tooltip"></div>
      <div id="legend"></div>
    </div>
  );
}

function createTreemapDiagram(data) {
  const width = 800;
  const height = 600;

  const treemap = d3.treemap()
    .size([width, height])
    .padding(1);

  const root = d3.hierarchy(data)
    .sum(d => d.value);

  treemap(root);

  const svg = d3.select("#treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const cellRect = cell.append("rect")
    .attr("class", "tile")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .on("mouseover", function(event, d) {
      const tooltip = document.getElementById("tooltip");
      tooltip.style.display = "block";
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
      tooltip.textContent = `${d.data.name}: $${d.data.value}`;
      tooltip.setAttribute("data-value", d.data.value);
    })
    .on("mouseout", function() {
      document.getElementById("tooltip").style.display = "none";
    });

  const cellText = cell.append("text")
    .attr("x", 5)
    .attr("y", 15)
    .attr("fill", "white")
    .attr("class", "tile-text")
    .text(d => d.data.name);
    

  const categories = [...new Set(root.leaves().map(d => d.data.category))];
  const legend = d3.select("#legend")
    .selectAll("div")
    .data(categories)
    .enter().append("div")
    .attr("class", "legend-item")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-bottom", "5px");

  const legendRect = legend.append("svg")
    .attr("width", 20)
    .attr("height", 20)
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => colorScale(d));

  const legendText = legend.append("span")
    .text(d => d)
    .style("margin-right", "10px")
    .style("margin-left", "5px")
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

