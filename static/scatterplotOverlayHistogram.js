function arrMax(arr) {
    let max = arr[0];
    for (let i =0; i< arr.length; ++i) {
		if (arr[i] > max){
			max = arr[i];
		}
	}
	return max;
}

function arrMin(arr) {
    let min = arr[0];
    for (let i =0; i< arr.length; ++i) {
		if (arr[i] < min){
			min = arr[i];
		}
	}
	return min;
}

function scatterplotOverlayHistogram(
    divID, csvHistFilename, csvScatterFilename, config) {
	let margin = {top: 100, right: 200, bottom: 60, left: 150},
	    width = 2300 - margin.left - margin.right,
	    height = 1100 - margin.top - margin.bottom;
	// Cobalt Blue -> Light Blue
	let colors = ['rgb(0, 71, 171)', 'rgb(173, 216, 230)'];

	let svg = d3.select(divID)
		      .append('svg')
		      .attr('width', width + margin.left + margin.right)
		      .attr('height', height + margin.top + margin.bottom)
		      .append('g')
		      .attr(
			  'transform',
			  'translate(' + margin.left + ',' + margin.top + ')');

	// TESTING with infection data from John Hopkins
	/*
	 month_counts_new_infections = [
	   {"Month" :"2020_01", "Count": 9927},
	   {"Month"}
	   , "2020_02": 76096, "2020_03": 783348, "2020_04": 2412716, "2020_05":
	 2901229, "2020_06": 4292072, "2020_07": 7118656, "2020_08": 7941296,
	 "2020_09": 8498335, "2020_10": 12122070, "2020_11": 17266494,
	 "2020_12": 20356383, "2021_01": 19546070, "2021_02": 11253786,
	 "2021_03": 14772312, "2021_04": 22542204, "2021_05": 19347136,
	 "2021_06": 11472596, "2021_07": 15676958, "2021_08": 19894993,
	 "2021_09": 16061455, "2021_10": 13064658, "2021_11": 15702891,
	 "2021_12": 25614610, "2022_01": 90483564, "2022_02": 58251972,
	 "2022_03": 51347034, "2022_04": 25217142, "2022_05": 16213566,
	 "2022_06": 17732748, "2022_07": 29650733, "2022_08": 25713990,
	 "2022_09": 14721332, "2022_10": 12795215, "2022_11": 12388536,
	 "2022_12": 17219669, "2023_01": 10270797, "2023_02": 4587649}
	 ]
	 */
	 const YEARS = ["2020", "2021", "2022", "2023"];
	 const MONTHS = ["01", "02", "03", "04", "05", "06",
					 "07", "08", "09", "10", "11", "12"]
	 let YEAR_MONTH = [];
	 for (let i = 0; i < YEARS.length; ++i) {
		 for (let j = 0; j < MONTHS.length; ++j) {
			 let interval = YEARS[i] + '-' + MONTHS[j];
			 YEAR_MONTH.push(interval);
			 if (interval == "2023-08"){
				 break;
			 }
		 }
	 }

	// FORMAT: {"Month": '2019-12',"Score": 20},
	// This is the data for the phylogenetic entropy plot
	d3.csv(csvHistFilename, function(data) {
		// This is the data for scatter plot points
		d3.csv(csvScatterFilename, function(RIVET_DATA) {
			let months = [];
			let counts = [];
			for (let i = 0; i < data.length; ++i) {
				months[i] = data[i]['Month'];
				counts[i] = parseInt(data[i]['Count']);
			}
			let RIVET_COUNTS = {};
			let RIVET_DATA_OBJECT = [];
			for (let i = 0; i < RIVET_DATA.length; ++i) {
				d = {
					'Month': RIVET_DATA[i]['Month'],
					'Score':
					    parseFloat(RIVET_DATA[i]['Score'])
				};
				RIVET_DATA_OBJECT.push(d);
			}

			let best_fit_data = {};
			let num_months = 0;
			for (let i = 0; i < RIVET_DATA.length; ++i) {
				// Month
				let m = RIVET_DATA[i]['Month'];
				// Fitness Score (eg. scatter plot point)
				let s = parseFloat(RIVET_DATA[i]['Score']);
				if (best_fit_data.hasOwnProperty(m)) {
					best_fit_data[m].push(s);
				} else {
					best_fit_data[m] = [s];
					num_months += 1;
				}
			}
			const arrAvg = arr =>
			    arr.reduce((a, b) => a + b, 0) / arr.length

			let average_more_fit = [];
			let average_less_fit = [];

			let max_more_fit = [];
			let max_less_fit = [];

            // The variance during each time-period interval
			let variance = [];
			let max_variance = 0;

            // The stddev during each time-period interval
			let stddev = [];
			let max_std_dev = 0;

			for (let i = 0; i < months.length; ++i) {
				let points = best_fit_data[months[i]];
				// If there are any recombinants inferred during this time interval
				if (points) {
					let calculated_variance = ss.variance(points);
					let v = {'Month': months[i],
					        'Value': calculated_variance
						}
					variance.push(v);
					if (calculated_variance > max_variance){
						max_variance = calculated_variance;
					}

					let calculated_std_dev = ss.standardDeviation(points);
					let s = {'Month': months[i],
					        'Value': calculated_std_dev
						}
					stddev.push(s);
					if (calculated_std_dev > max_std_dev){
						max_std_dev = calculated_std_dev;
					}

					let filtered_points = points.filter(
					    (fitness) => fitness >= 1.0);
                    
                    if (filtered_points.length > 0) {
     					d = {
     						'Month': months[i],
     						'Value': arrAvg(filtered_points)
     					};

     					d_max = {
     						'Month': months[i],
     						'Value': arrMax(filtered_points)
     					};
     					average_more_fit.push(d);
						max_more_fit.push(d_max);

					} else {
     					d = {
     						'Month': months[i],
     						'Value': 1.0
     					};
     					average_more_fit.push(d);
						max_more_fit.push(d);
					}

					let below_average_points = points.filter(
					    (fit) => fit < 1.00000000);

                    if (below_average_points.length > 0) {
    					d_below_avg = {
    						'Month': months[i],
    						'Value': arrAvg(below_average_points)
    					};
    					d_min = {
    						'Month': months[i],
    						'Value': arrMin(below_average_points)
    					};
    					average_less_fit.push(d_below_avg);
    					max_less_fit.push(d_min);
					} else {
    					d_below_avg = {
    						'Month': months[i],
    						'Value': 1.0
    					};
    					average_less_fit.push(d_below_avg);
    					max_less_fit.push(d_below_avg);
					}

				} else {
					d = {'Month': months[i], 'Value': 1.0};
				    average_more_fit.push(d);
				    average_less_fit.push(d);
					max_more_fit.push(d);
					max_less_fit.push(d);
				}
			}

			let colorGrad =
			    d3.scaleLinear()
				.domain(
				    [d3.min(counts) + 20, d3.max(counts) - 20])
				.range(
				    ['rgb(173, 216, 230)', 'rgb(0, 71, 171)']);

			let x0 = d3.scaleBand()
				     //.domain(months)
				     .domain(YEAR_MONTH)
				     .range([0, width])
				     .paddingOuter(0.2)
				     .paddingInner(0.4);

			let yLeft =
			    d3.scaleLinear().domain([0, d3.max(counts)]).range([
				    height, 0
			    ]);

			let yTEST = d3.scaleLinear()
					.domain([0.0, 4.0])
					.range([height, 0]);

			const xAxis = d3.axisBottom(x0);
			const yLeftAxis = d3.axisLeft(yLeft).ticks(20);
			const yLeftAxisTEST = d3.axisLeft(yTEST).ticks(20);

			svg.append('g')
			    .attr('class', 'bottomAxis')
			    .attr('transform', 'translate(0,' + height + ')')
			    .data([YEAR_MONTH])
			    .call(d3.axisBottom(x0))
			    .selectAll('text')
			    .style('text-anchor', 'end')
			    .attr('dx', '-.8em')
			    .attr('dy', '.15em')
			    .attr('transform', 'rotate(-65)');

			svg.append('g')
			    .attr('class', 'y0 axis')
			    .call(yLeftAxisTEST)
			    .append('text')
			    .attr('transform', 'rotate(-90)')
			    .attr('x', -85)
			    .attr('y', -80)
			    .attr('dominant-baseline', 'start')
			    .style('font-size', '24px')
			    .style('fill', 'red')
			    .text(config['yAxisTitle']);

			if (config['yRightAxisTitle']) {
				let yRight = d3.scaleLinear()
						 .domain([0, d3.max(counts)])
						 .range([height, 0]);
				const yRightAxis =
				    d3.axisRight(yRight).ticks(20);

				svg.append('g')
				    .attr('class', 'y1 axis')
				    .attr(
					'transform',
					'translate(' + width + ',0)')
				    .call(yRightAxis)
				    .append('text')
				    .attr('transform', 'rotate(-90)')
				    .attr('x', -550)
				    .attr('y', 95)
				    .attr('dominant-baseline', 'central')
				    .style('font-size', '24px')
				    .style('fill', 'blue')
				    .text(config['yRightAxisTitle']);
			}
			// --------------------------------------------------------------------------------------------
			// Looking at correlation coefficient between more fit recombinants, on average, vs genetic diversity
			// --------------------------------------------------------------------------------------------

			//console.log("RIVET On Average, More Fit Recombinants: ", average_more_fit);
			average_more_fit_counts = [];
			for (let i = 0; i < months.length; ++i) {
				average_more_fit_counts.push(average_more_fit[i]["Value"]);
			}
			//console.log("RIVET On Average, More Fit Recombinants COUNTS: ", average_more_fit_counts);

			let corr_more_average = ss.sampleCorrelation(counts, average_more_fit_counts).toFixed(2);
            //console.log('correlation coefficient plot 2: ', corr_more_average);

			// --------------------------------------------------------------------------------------------
			// Looking at correlation coefficient between less fit recombinants, on average, vs genetic diversity
			// --------------------------------------------------------------------------------------------

			//console.log("LOOKING AT ON AVERAGE, LESS FIT RECOMBINANTS");

			//console.log("RIVET On Average, Less Fit Recombinants: ", average_less_fit);
			average_less_fit_counts = [];
			for (let i = 0; i < months.length; ++i) {
				average_less_fit_counts.push(average_less_fit[i]["Value"]);
			}
			//console.log("RIVET On Average, Less Fit Recombinants COUNTS: ", average_less_fit_counts);

			let corr_less_average = ss.sampleCorrelation(counts, average_less_fit_counts).toFixed(2);
            //console.log('correlation coefficient less fit on average: ', corr_less_average);

			svg.selectAll('rect')
			    .data(data)
			    .enter()
			    .append('rect')
			    .attr('id', 'hist')
			    .attr('width', x0.bandwidth())
			    .attr(
				'x',
				function(d, i) {
					return x0(months[i]);
				})
			    .attr(
				'y',
				function(d) {
					return yLeft(d.Count)
				})
			    .attr(
				'height',
				function(d, i) {
					return height - yLeft(d.Count);
				})
			    .style('fill', function(d, i) {
				    return colorGrad(d.Count);
			    })

			svg.append('g')
			    .attr(
				'transform', 'translate(0, ' + yTEST(1.0) + ')')
			    .append('line')
			    .attr('x2', width)
			    .style('stroke', 'black')
			    .style('stroke-dasharray', ('3, 3'))
			    .style('stroke-width', '5px');

			let SHIFT_RIGHT = x0.bandwidth() / 2;
			svg.append('g')
			    .selectAll('dot')
			    .data(RIVET_DATA_OBJECT)
			    .enter()
			    .append('circle')
			    .attr(
				'cx',
				function(d) {
					return x0(d.Month);
				})
			    .attr(
				'cy',
				function(d) {
					return yTEST(d.Score);
				})
			    .attr('r', 3.5)
			    // Shift points right to the center of histogram
			    // bars
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
			    .style('fill', 'red');

			// Add title to the plot
			svg.append('text')
			    .attr('x', (width / 2))
			    .attr('y', 0 - (margin.top / 4))
			    .attr('text-anchor', 'middle')
			    .style('font-size', '16px')
			    .style('text-decoration', 'underline')
			    .style('font-size', '30px')
			    .text(config['title']);
            
			if (config['variance']) {
			let yLeftVariance =
			    d3.scaleLinear().domain([0, max_variance]).range([
				    height, 0
			    ]);
				svg.append('path')
				    .data([variance])
				    .attr('fill', 'none')
				    .attr('stroke', '#ffdf00')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr( 'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yLeftVariance(d.Value)
					    }))
			}

			let yLeftStdDev =
			    d3.scaleLinear().domain([0, max_std_dev]).range([
				    height, 0
			    ]);
				svg.append('path')
				    .data([stddev])
				    .attr('fill', 'none')
				    .attr('stroke', '#FF5733')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr( 'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yLeftStdDev(d.Value)
					    }))

			// Add best fit line to the plot
			if (config['best_fit']) {
				svg.append('path')
				    .data([average_more_fit])
				    .attr('fill', 'none')
				    .attr('stroke', '#AAFF00')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr( 'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yTEST(d.Value)
					    }))

				svg.append('path')
				    .data([average_less_fit])
				    .attr('fill', 'none')
				    .attr('stroke', '#AAFF00')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr(
					'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yTEST(d.Value)
					    }))
			}

			if (config['capacity']) {
				svg.append('path')
				    .data([max_more_fit])
				    .attr('fill', 'none')
				    .attr('stroke', 'orange')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr( 'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yTEST(d.Value)
					    }))

				svg.append('path')
				    .data([max_less_fit])
				    .attr('fill', 'none')
				    .attr('stroke', 'orange')
				    .attr('stroke-width', 1.5)
			    .attr(
				'transform',
				'translate(' + SHIFT_RIGHT + ',' + 0 + ')')
				    .attr(
					'd',
					d3.line()
					    .x(function(d) {
						    return x0(d.Month)
					    })
					    .y(function(d) {
						    return yTEST(d.Value)
					    }))
			}
		});
	});
}