window.onload = main;

function main() {
	// Graph for fitness of Pango-lineages over time
	pango_lineage_config = {
		'title': 'Fitness of Pango Lineages Over Time',
		'yAxisTitle': 'R/RA Fitness',
		'xAxisTitle': 'Date of Pango Lineage Emergence (Month)',
		'baseline': false
	};

	scatterplot(
	    '#pango-lineages', 'data/RANKED_PANGO_STRAINS.csv',
	    pango_lineage_config);

	// Graph for fitness of Pango-recombinant lineages over time
	pango_recombinant_lineage_config = {
		'title':
		    'Fitness of Pango-identified Recombinant Lineages Over Time',
		'yAxisTitle': 'R/RA Fitness',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': false
	};

	scatterplot(
	    '#pango-recomb-lineages', 'data/RANKED_PANGO_RECOMB_STRAINS.csv',
	    pango_recombinant_lineage_config);

	/*
	pango_recombinant_lineage_avg_config = {
	  "title": "Fitness of Pango-identified Recombinant Lineages wrt Avg
	Parents Over Time", "yAxisTitle": "R/RA Fitness wrt Avg of Parents",
	  "xAxisTitle": "Date of Emergence (Month)",
	  "baseline": true
	}
	scatterplot('#pango-recomb-lineages-avg',
	'RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_AVG.csv',
	pango_recombinant_lineage_avg_config);
	*/

	pango_recombinant_lineage_avg_diversity_config = {
		'title':
		    'Fitness of Pango-identified Recombinant Lineages wrt Avg Parents Over Time vs Standing Genetic Diversity',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Avg(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		// time-interval: "month" or "week" or "quarter"
		// TODO: Generate the data for all these types and have it be
		// loadable upon click.
		'time-interval': 'month',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#pango-recomb-lineages-avg', 'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_AVG.csv',
	    pango_recombinant_lineage_avg_diversity_config);

	/*
	pango_recombinant_lineage_max_config = {
	  "title": "Fitness of Pango-identified Recombinant Lineages wrt Max
	Parents Over Time", "yAxisTitle": "R/RA Fitness wrt Max of Parents",
	  "xAxisTitle": "Date of Emergence (Month)",
	  "baseline": true
	}
	scatterplot('#pango-recomb-lineages-max',
	'RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_MAX.csv',
	pango_recombinant_lineage_max_config);
	*/

	pango_recombinant_lineage_max_diversity_config = {
		'title':
		    'Fitness of Pango-identified Recombinant Lineages wrt Max Parents Over Time',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Max(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		// time-interval: "month" or "week" or "quarter"
		// TODO: Generate the data for all these types and have it be
		// loadable upon click.
		'time-interval': 'month',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#pango-recomb-lineages-max', 'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_MAX.csv',
	    pango_recombinant_lineage_max_diversity_config);

	rivet_recombinant_lineage_reference_config = {
		'title':
		    'RIVET-inferred Recombinants Fitness Advantage Over NC_045512.2',
		'yAxisTitle': 'R/RA Fitness Advantage Over NC_045512.2',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': false
	};

	scatterplot(
	    '#rivet-recomb-lineages-reference',
	    'data/RANKED_RIVET_RECOMBINANTS_REF.csv',
	    rivet_recombinant_lineage_reference_config);

	rivet_recombinant_lineage_reference_passing_config = {
		'title':
		    'RIVET-inferred Recombinants (Passing All Filtration Checks) Fitness Advantage Over NC_045512.2',
		'yAxisTitle': 'R/RA Fitness Advantage Over NC_045512.2',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': false
	};

	scatterplot(
	    '#rivet-recomb-lineages-reference-passing',
	    'data/RANKED_RIVET_RECOMBINANTS_REF_PASSING.csv',
	    rivet_recombinant_lineage_reference_passing_config);

	// Graph for fitness of RIVET-inferred recombinant lineages over time,
	// wrt average fitness of parents
	rivet_recombinant_lineage_avg_parents_config = {
		'title':
		    'RIVET-inferred Recombinants Fitness Advantage Over Parents Fr/Avg(Fp)',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true
	};

	scatterplot(
	    '#rivet-recomb-lineages-avg-parents',
	    'data/RANKED_PANGO_RECOMB_PARENTS_AVERAGE_STRAINS.csv',
	    rivet_recombinant_lineage_avg_parents_config);

	// Graph for fitness of RIVET-inferred recombinant lineages over time,
	// wrt average fitness of parents
	rivet_recombinant_lineage_avg_parents_passing_config = {
		'title':
		    'RIVET-inferred Recombinants (Passing All Filtration Checks) Fitness Advantage Over Parents Fr/Avg(Fp)',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true
	};

	scatterplot(
	    '#rivet-recomb-lineages-avg-parents-passing',
	    'data/RANKED_PANGO_RECOMB_PARENTS_AVERAGE_STRAINS_PASSING.csv',
	    rivet_recombinant_lineage_avg_parents_passing_config);

	// Graph for fitness of RIVET-inferred recombinant lineages over time,
	// wrt max fitness of parents
	rivet_recombinant_lineage_max_parents_config = {
		'title':
		    'RIVET-inferred Recombinants Fitness Advantage Over Parents Fr/Max(Fp)',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true
	};

	scatterplot(
	    '#rivet-recomb-lineages-max-parents',
	    'data/RANKED_PANGO_RECOMB_PARENTS_MAX_STRAINS.csv',
	    rivet_recombinant_lineage_max_parents_config);

	// Graph for fitness of RIVET-inferred recombinant lineages over time,
	// wrt max fitness of parents
	rivet_recombinant_lineage_max_parents_passing_config = {
		'title':
	    'RIVET-inferred Recombinants (Passing All Filtration Checks) Fitness Advantage Over Parents Fr/Max(Fp)',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true
	};

	scatterplot(
	    '#rivet-recomb-lineages-max-parents-passing',
	    'data/RANKED_PANGO_RECOMB_PARENTS_MAX_STRAINS_PASSING.csv',
	    rivet_recombinant_lineage_max_parents_passing_config);


	rivet_recombinant_diversity_rivet_max_config = {
		'title':
		    'RIVET-inferred Recombinants Fitness Advantage Over Parents vs Standing Genetic Diveristy',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Max(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#rivet-recomb-overlay-diversity-max', 'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_PARENTS_MAX_STRAINS.csv',
	    rivet_recombinant_diversity_rivet_max_config);

	rivet_recombinant_diversity_rivet_max_passing_config = {
		'title':
		    'RIVET-inferred Recombinants (Passing All Filtration Checks) Fitness Advantage Over Parents vs Standing Genetic Diveristy',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Max(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#rivet-recomb-overlay-diversity-max-passing',
	    'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_PARENTS_MAX_STRAINS_PASSING.csv',
	    rivet_recombinant_diversity_rivet_max_passing_config);

	rivet_recombinant_diversity_rivet_avg_config = {
		'title':
		    'RIVET-inferred Recombinants Fitness Advantage Over Parents vs Standing Genetic Diversity',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Avg(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#rivet-recomb-overlay-diversity-avg', 'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_PARENTS_AVERAGE_STRAINS.csv',
	    rivet_recombinant_diversity_rivet_avg_config);

	rivet_recombinant_diversity_rivet_avg_passing_config = {
		'title':
		    'RIVET-inferred Recombinants (Passing All Filtration Checks) Fitness Advantage Over Parents vs Standing Genetic Diversity',
		'yAxisTitle': 'R/RA Fitness Advantage Over Parents Fr/Avg(Fp)',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Date of Emergence (Month)',
		// time-interval: "month" or "week" or "quarter"
		// TODO: Generate the data for all these types and have it be
		// loadable upon click.
		'time-interval': 'month',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	scatterplotOverlayHistogram(
	    '#rivet-recomb-overlay-diversity-avg-passing',
	    'data/diversity_scores.tsv',
	    'data/RANKED_PANGO_RECOMB_PARENTS_AVERAGE_STRAINS_PASSING.csv',
	    rivet_recombinant_diversity_rivet_avg_passing_config);

	stacked_histogram_config = {
		'title': 'Circulating Lineage Proportions during each Month',
		'yAxisTitle': 'Proportion of Total Circulating Lineages',
		'yRightAxisTitle': 'Phylogenetic Entropy Score',
		'xAxisTitle': 'Time Interval (Month)',
		'baseline': true,
		'best_fit': true,
		'capacity': true,
		'variance': false
	};

	stackedHistogram(
	    '#stacked-lineage-hist', 'data/lineages.csv', stacked_histogram_config);

/*
	let checkbox = document.querySelector('#variance')
	checkbox.addEventListener('change', function() {
		if (this.checked) {
			console.log('Checkbox is checked..');
			// Show variance
			pango_recombinant_lineage_avg_diversity_config['variance'] =
			    true;

			scatterplotOverlayHistogram(
			    '#pango-recomb-lineages-avg',
			    'diversity_scores.tsv',
			    'RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_AVG.csv',
			    pango_recombinant_lineage_avg_diversity_config);

		} else {
			// Disable variance
			console.log('Checkbox is not checked..');
			pango_recombinant_lineage_avg_diversity_config['variance'] =
			    false;

			scatterplotOverlayHistogram(
			    '#pango-recomb-lineages-avg',
			    'diversity_scores.tsv',
			    'RANKED_PANGO_RECOMB_STRAINS_WITH_PARENTS_AVG.csv',
			    pango_recombinant_lineage_avg_diversity_config);
		}
	});
	*/
}
