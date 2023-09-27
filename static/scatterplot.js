// TODO: Add documentation
// 2-D simple histogram
// X-axis is time binned (eg. months)
// Y-axis is Counts (some numeric metric)
// Simple scatterplot visualization
// Data should be formatted something like this.
/*
  {"Month": '2019-12',"Score": 10},
*/

function scatterplot(divID, csvFilename, config) {
	const margin = {top: 100, right: 200, bottom: 150, left: 150},
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

	const YEARS = ['2020', '2021', '2022', '2023'];
	const MONTHS = [
		'01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
		'11', '12'
	];

	let YEAR_MONTH = [];
	for (let i = 0; i < YEARS.length; ++i) {
		for (let j = 0; j < MONTHS.length; ++j) {
			let interval = YEARS[i] + '-' + MONTHS[j];
			YEAR_MONTH.push(interval);
			if (interval == '2023-08') {
				break;
			}
		}
	}

	d3.csv(csvFilename, function(RIVET_DATA) {
		// Data formatting
		let months = [];
		let RIVET_DATA_OBJECT = [];
		let max = 0.0
		for (let i = 0; i < RIVET_DATA.length; ++i) {
			let score = parseFloat(RIVET_DATA[i]['Score']);
			d = {
				'Month': RIVET_DATA[i]['Month'],
				'Score': score,
				'Strain': RIVET_DATA[i]['Strain'],
				'Node': RIVET_DATA[i]['Node']
			};
			if (score > max) {
				max = score;
			}
			RIVET_DATA_OBJECT.push(d);
			months[i] = RIVET_DATA[i]['Month'];
		}
		// Sort time intervals (months) from past-present
		months.sort();

		// X-axis is time binned as months
		let x = d3.scaleBand()
			    .domain(YEAR_MONTH)
			    .range([0, width])
			    .paddingOuter(0.2)
			    .paddingInner(0.4);

		let y = d3.scaleLinear().domain([0.0, max + 1.0]).range([
			height, 0
		]);

		const xAxis = d3.axisBottom(x);
		const yLeftAxis = d3.axisLeft(y).ticks(20);
		const tooltip = d3.select(divID)
				    .append('div')
				    .attr('id', 'tooltip')
				    .style('position', 'absolute')
				    .style('visibility', 'hidden')
				    .style('padding', '15px')
				    .style('background', 'rgba(0,0,0,0.6)')
				    .style('border-radius', '5px')
				    .style('color', 'white');

		svg.append('g')
		    .attr('class', 'bottomAxis')
		    .attr('transform', 'translate(0,' + height + ')')
		    .data([months])
		    .call(d3.axisBottom(x))
		    .selectAll('text')
		    .style('text-anchor', 'end')
		    .attr('dx', '-.8em')
		    .attr('dy', '.15em')
		    .attr('transform', 'rotate(-65)')

		svg.append('text')
		    .attr('class', 'x label')
		    .attr('text-anchor', 'end')
		    .attr('x', width / 2)
		    .attr('y', height + 100)
		    .attr('dx', '.75em')
		    .style('font-size', '24px')
		    .style('fill', 'black')
		    .text(config['xAxisTitle']);

		svg.append('g')
		    .attr('class', 'y0 axis')
		    .call(yLeftAxis)
		    .append('text')
		    .attr('transform', 'rotate(-90)')
		    .attr('x', -400)
		    .attr('y', -80)
		    .attr('dominant-baseline', 'central')
		    .style('fill', 'black')
		    .style('font-size', '24px')

		svg.append('text')
		    .attr('class', 'y label')
		    .attr('text-anchor', 'end')
		    .attr('x', -300)
		    .attr('y', -80)
		    .attr('dy', '.75em')
		    .style('font-size', '24px')
		    .attr('transform', 'rotate(-90)')
		    .text(config['yAxisTitle']);


		if (config['baseline']) {
			// Add horizontal dashed line at 1.0 mark on y-axis
			svg.append('g')
			    .attr('transform', 'translate(0, ' + y(1.0) + ')')
			    .append('line')
			    .attr('x2', width)
			    .style('stroke', 'black')
			    .style('stroke-dasharray', ('3, 3'))
			    .style('stroke-width', '5px');
		}
		let colorScale = d3.scaleLinear().domain([0, 120]).range(
		    ['powderblue', 'midnightblue']);

		let SHIFT_POINTS_RIGHT = x.bandwidth() / 2;
		let RADIUS = 3.5;
		svg.append('g')
		    .selectAll('dot')
		    .data(RIVET_DATA_OBJECT)
		    .enter()
		    .append('circle')
		    .attr(
			'cx',
			function(d) {
				return x(d.Month);
			})
		    .attr(
			'cy',
			function(d) {
				return y(d.Score);
			})
		    .attr(
			'r',
			function(d) {
				return RADIUS;
				// TODO: Create a lookup table for VOCs
				/*
				let strain = d['Strain'];
				if (strain == "XBB") {
					return RADIUS + 5;
				}else {
				    return RADIUS;
				}
				*/
				// Shift points right to center of histogram
				// bars
			})
		    .attr(
			'transform',
			'translate(' + SHIFT_POINTS_RIGHT + ',' + 0 + ')')
		    // TODO: Make the color part of object config
		    .style(
			'fill',
			function(d) {
				return 'red';
				/*
				let strain = d['Strain'];
				if (strain == "XBB") {
					return 'blue';
				}else {
				    return 'red';
				}
				*/
			})
		    .on('mouseover',
			function(d) {
				let strain = d['Strain'];
				let node = d['Node'];
				let score =
				    Math.round(d['Score'] * 1000) / 1000;
				tooltip
				    .html(`Strain: ${strain},  R/RA: ${
					score}, NodeID: ${node}`)
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
				// TODO: Color major VOCs -> Add a lookup table
				.style('fill', 'red')
		    });

		// Add title to the plot
		svg.append('text')
		    .attr('x', (width / 2))
		    .attr('y', 0 - (margin.top / 4))
		    .attr('text-anchor', 'middle')
		    .style('font-size', '16px')
		    .style('text-decoration', 'underline')
		    .style('font-size', '30px')
		    .text(config['title']);
	});
}
