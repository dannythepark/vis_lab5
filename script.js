d3.csv("coffee-house-chains.csv", d3.autoType).then(data => {
    update(data, group, decr);

    d3.select('#group').on('change', (e) => {
      console.log('group button changed');
      group = d3.select('#group').node().value;
      update(data, group, decr);
    });

    d3.select('.sorting').on('click', (e) => {
      console.log('sort button clicked');
      decr = !decr
      update(data, group, decr);
    });

  });

  const margin = { top: 30, left: 50, bottom: 30, right: 30 };
  const width = 600 - margin.left - margin.bottom;
  const height = 400 - margin.top - margin.bottom;
    
  const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.2);
        
  const yScale = d3.scaleLinear()
    .range([height, 0]);
        
  const svg = d3.select('.graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');
    
  svg.append('g')
    .attr("class", "y-axis");

  svg.append('g')
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg.append("text")
    .attr("class", "y-label")
    .attr("y", -5)
    .attr("text-anchor", "start");

    

  let decr = true;
  let group = 'stores';

  function update(data, group, decr) {
    if (decr) {
      data.sort((a, b) => a[group] - b[group]).reverse();
    }
    else {
      data.sort((a, b) => a[group] - b[group]);
    }

  xScale.domain(data.map(d => d.company));
  yScale.domain([0, d3.max(data, d => d[group])]);


  const bars = svg.selectAll('.bars')
    .data(data);

  bars.enter()
    .append("rect")
    .attr("class", "bars")
    .attr('fill', '#c06fc0')
    .attr('x', d => xScale(d.company))
    .attr("width", xScale.bandwidth())
    .merge(bars)
    .transition()
    .duration(1000)
    .attr('y', d => yScale(d[group]))
    .attr("height", d => height - yScale(d[group]));

  bars
    .exit()
    .remove();

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  svg.select('.x-axis')
    .transition()
    .duration(1000)
    .call(xAxis);

  svg.select('.y-axis')
    .transition()
    .duration(1000)
    .call(yAxis);

  svg.select(".y-label")
    .text(function (d) {
      if (group == 'stores') { 
          return "Stores" 
        } 
      else { 
          return "Billion USD" 
        };
    });

  }