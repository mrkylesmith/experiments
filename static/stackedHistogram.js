
function randomColor() {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	return '#' + randomColor;
}

function stackedHistogram(divID, lineage_data_file, config) {
	// const margin = {top: 100, right: 200, bottom: 100, left: 150},
	//  TODO: Fix width once dates are matched with other histograms
	// width = 2048 - margin.left - margin.right,

	const margin = {top: 100, right: 200, bottom: 200, left: 150},
	      width = 2300 - margin.left - margin.right,
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
		THRESHOLD = 0.85;

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

		NUM_BY_MONTH = [];
		for (const [key, value] of Object.entries(DATA)) {
			let count = 0;
			let sum = 0.0
			for (let i = 0; i < value.length; ++i) {
				sum += parseFloat(value[i]);

				if (sum < THRESHOLD) {
					++count;
				} else {
					NUM_BY_MONTH.push(count);
					break;
				}
			}
		}
		NUM_BY_MONTH_DICT = {};

		for (let i = 0; i < MONTHS.length; ++i) {
			NUM_BY_MONTH_DICT[MONTHS[i]] = NUM_BY_MONTH[i];
		}

		let subgroups = Object.keys(DATA[0]);
		let groups = MONTHS;

		let y = d3.scaleLinear().domain([0, 1.05]).range([height, 0]);

		svg.append('g').call(d3.axisLeft(y));

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

		// Append bottom x axis title
		svg.append('text')
		    .attr('class', 'x label')
		    .attr('text-anchor', 'end')
		    .attr('x', width / 2)
		    .attr('y', height + 100)
		    .attr('dx', '.75em')
		    .style('font-size', '24px')
		    .style('fill', 'black')
		    .text(config['xAxisTitle']);

		let colorSet = [];
		for (let i = 0; i < subgroups.length; ++i) {
			colorSet.push(randomColor());
		}
		let color = d3.scaleOrdinal().domain(subgroups).range(colorSet);

		const stackedData = d3.stack().keys(subgroups)(DATA);

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

		// Append left y-axis title
		svg.append('text')
		    .attr('class', 'y label')
		    .attr('text-anchor', 'middle')
		    .attr('x', -300)
		    .attr('y', -80)
		    .attr('dy', '.75em')
		    .style('font-size', '24px')
		    .attr('transform', 'rotate(-90)')
		    .text(config['yAxisTitle']);

		if (config['baseline']) {
			// Add horizontal dashed line at 1.0 mark on y-axis
			svg.append('g')
			    .attr(
				'transform',
				'translate(0, ' + y(THRESHOLD) + ')')
			    .append('line')
			    .attr('x2', width)
			    .style('stroke', 'black')
			    .style('stroke-dasharray', ('3, 3'))
			    .style('stroke-width', '5px');
		}


		let circleScale =
		    d3.scaleLinear().domain(NUM_BY_MONTH).range([0.5, 1.0]);

		let SHIFT_RIGHT = x.bandwidth() / 2;
		svg.append('g')
		    .selectAll('dot')
		    .data(groups)
		    .enter()
		    .append('circle')
		    .attr(
			'cx',
			function(d) {
				// Month
				return x(d);
			})
		    .attr(
			'cy',
			function(d) {
				return y(1.05);
			})
		    .attr(
			'r',
			function(d) {
				return circleScale(NUM_BY_MONTH_DICT[d]) * 5;
			})
		    // Shift points right to the center of histogram
		    // bars
		    .attr(
			'transform', 'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
		    .style('fill', 'red')
		    .on('mouseover',
			function(d) {
				// Number of lineages or countries contributing
				// up to THRESHOLD
				let value = NUM_BY_MONTH_DICT[d];
				tooltip.html(`${value}`)
				    .style('visibility', 'visible');

				d3.select(this)
				    .style('fill', 'green')
				    .attr('stroke-width', '1')
				    .attr('stroke', 'black');
			})
		    .on('mousemove',
			function() {
				tooltip.style('top', (event.pageY - 10) + 'px')
				    .style('left', (event.pageX + 10) + 'px');
			})
		    .on('mouseout', function() {
			    tooltip.html(``).style('visibility', 'hidden');
			    d3.select(this)
				.attr('stroke-width', '0')
				.style('fill', 'red')
		    });


		// Add title to the plot
		svg.append('text')
		    .attr('x', (width / 2))
		    .attr('y', 0 - (margin.top / 1.5))
		    .attr('text-anchor', 'middle')
		    .style('font-size', '16px')
		    .style('text-decoration', 'underline')
		    .style('font-size', '30px')
		    .text(config['title']);
	})
}
