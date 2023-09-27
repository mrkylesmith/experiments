
function randomColor() {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	return '#' + randomColor;
}

function stackedHistogram(divID, lineage_data_file, config) {
	const margin = {top: 100, right: 200, bottom: 100, left: 150},
	      // TODO: Fix width once dates are matched with other histograms
	    width = 2048 - margin.left - margin.right,
	      height = 1100 - margin.top - margin.bottom;

	let svg = d3.select(divID)
		      .append('svg')
		      .attr('width', width + margin.left + margin.right)
		      .attr('height', height + margin.top + margin.bottom)
		      .append('g')
		      .attr(
			  'transform',
			  'translate(' + margin.left + ',' + margin.top + ')');

	d3.csv(lineage_data_file, function(data) {
		MONTHS = [];
		LINEAGE_TABLE = [];

		for (const dict of data) {
			let month = dict['Month'];
			MONTHS.push(month);
		}

		DATA = [];
		for (const dict of data) {
			month_data = {};
			MONTH_DATA = [];
			for (const [key, value] of Object.entries(dict)) {
				if (key != 'Month') {
					month_data[key] = value;
					MONTH_DATA.push(value);
				}
			}
			MONTH_DATA.sort().reverse();
			DATA.push(MONTH_DATA);
		}
		let subgroups = Object.keys(DATA[0]);
		let groups = MONTHS;

		let x =
		    d3.scaleBand().domain(groups).range([0, width]).padding([
			    0.2
		    ])

		svg.append('g')
		    .attr('transform', 'translate(0,' + height + ')')
		    .call(d3.axisBottom(x).tickSizeOuter(0))
		    .selectAll('text')
		    .style('text-anchor', 'end')
		    .attr('dx', '-.8em')
		    .attr('dy', '.15em')
		    .attr('transform', 'rotate(-65)');

		let y = d3.scaleLinear().domain([0, 1.0]).range([height, 0]);

		svg.append('g').call(d3.axisLeft(y));

		let colorSet = [];
		for (let i = 0; i < subgroups.length; ++i) {
			colorSet.push(randomColor());
		}
		let color = d3.scaleOrdinal().domain(subgroups).range(colorSet);

		const stackedData = d3.stack()
					.keys(subgroups)
					.order(d3.stackOrderDescending)
					.offset(d3.stackOffsetNone)(DATA);

		const tooltip = d3.select(divID)
				    .append('div')
				    .style('position', 'absolute')
				    .style('visibility', 'hidden')
				    .style('padding', '15px')
				    .style('background', 'rgba(0,0,0,0.6)')
				    .style('border-radius', '5px')
				    .style('color', 'white');

		svg.append('g')
		    .selectAll('g')
		    .data(stackedData)
		    .enter()
		    .append('g')
		    .attr(
			'fill',
			function(d) {
				return randomColor();
			})
		    .selectAll('rect')
		    .data(function(d) {
			    return d;
		    })
		    .enter()
		    .append('rect')
		    .attr(
			'x',
			function(d, i) {
				return x(MONTHS[i]);
			})
		    .attr(
			'y',
			function(d, i) {
				return y(d[1]);
			})
		    .attr(
			'height',
			function(d) {
				return y(d[0]) - y(d[1]);
			})
		    //.attr('width', x.bandwidth())
		    // TODO: Temp width until dates are matched with other
		    // histograms
		    .attr('width', 26.59090909090909)
		    .on('mouseover',
			function(d, i) {
				let lineages = Object.keys(data[i]);
				lineages = lineages.slice(1);
				let values = Object.values(data[i]);
				let prop = Math.abs(d[0] - d[1]);
				prop = Math.round(prop * 10000000000) /
				    10000000000;

				for (let j = 0; j < values.length; ++j) {
					let roundedVal =
					    Math.round(
						parseFloat(values[j]) *
						10000000000) /
					    10000000000;
					if (prop == roundedVal) {
						let index = j - 1
						let l = lineages[index];
						/*
						console.log(
						    'Proportion: ', values[j]);
						console.log(
						    'Lineage: ',
						    lineages[index]);
						*/
						tooltip
						    .html(`Lineage: ${
							l}, Proportion: ${
							prop}`)
						    .style(
							'visibility',
							'visible');
					} else {
					}
				}
			})
		    .on('mousemove',
			function() {
				tooltip.style('top', (event.pageY - 10) + 'px')
				    .style('left', (event.pageX + 10) + 'px');
			})
		    .on('mouseout', function() {
			    tooltip.html(``).style('visibility', 'hidden');
			    d3.select(this).attr('stroke-width', '0')
		    });

		svg.append('g')
		    .selectAll('g')
		    .data(stackedData)
		    .enter()
		    .append('g')
		    .attr(
			'fill',
			function(d) {
				return randomColor();
			})
		    .selectAll('rect')
		    .data(function(d) {
			    return d;
		    })
		    .enter()
		    .append('rect')

		// Add title to the plot
		svg.append('text')
		    .attr('x', (width / 2))
		    .attr('y', 0 - (margin.top / 4))
		    .attr('text-anchor', 'middle')
		    .style('font-size', '16px')
		    .style('text-decoration', 'underline')
		    .style('font-size', '30px')
		    .text(config['title']);
	})
}
