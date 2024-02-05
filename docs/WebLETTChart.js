var myChart = new Chart(document.getElementById("myChart"), {
	type: 'scatter',
	data: {
		datasets: [{
			label: "Force vs Time",
			showLine: true,
			hidden: true,
			borderColor: '#d45087', // #FF6384',
			fill: false,
			data: []
		}, {
			label: "Resistance",
			display: false,
			showLine: true,
			hidden: true,
			borderColor: '#665191', //'#36A2EB',
			fill: false,
			data: []
		}, {
			label: "Force vs Extension",
			//label: "Temperature",
			showLine: true,
			borderColor: '#003f5c', //'lightBlue',
			fill: false,
			data: [{x:7, y:6}, {x:15, y:16}]
		}]
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
		}, 
		plugins: {
    			legend: {
      			display: false
    			}
  		}
	}
});
