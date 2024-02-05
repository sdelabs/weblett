var myChart = new Chart(document.getElementById("myChart"), {
	type: 'scatter',
	data: {
		datasets: [{
			label: "Force vs Extension",
			showLine: true,
			borderColor: '#003f5c', //'lightBlue',
			fill: false,
			data: [{x:7, y:6}, {x:15, y:16}]
		}, {
			label: "Force vs Time",
			showLine: true,
			hidden: true,
			borderColor: '#d45087', // #FF6384',
			fill: false,
			data: []
		}, {
			label: "Resistance (only on some LETTs",
			//label: "Temperature",
			showLine: true,
			hidden: true,
			borderColor: '#665191', //'#36A2EB',
			fill: false,
			data: []
		} ]
	},
	options: {
		responsive: true,
		scales: {
			xAxes: [{
			//type: 'linear', 
			scaleLabel: {
				display: true,
				labelString: 'extension',
			}
			}],
			yAxes: [{
			//type: 'linear', 
			scaleLabel: {
				display: true,
				labelString: 'force'
			}
			}]
		}
	}
});
