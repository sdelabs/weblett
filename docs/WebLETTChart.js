		var myChart = new Chart(document.getElementById("myChart"), {
		type: 'scatter',
		data: {
			datasets: [
			{
				label: "Force",
				showLine: true,
				borderColor: '#FF6384',
				fill: false,
				data: []
			},
			{
				label: "Resistance",
				showLine: true,
				borderColor: '#36A2EB',
				fill: false,
				data: []
			},
			{
				label: "Temperature",
				showLine: true,
				borderColor: '#45B1DF',
				fill: false,
				data: [{x:7, y:6}, {x:15, y:16}]
			}
			]
		},
		options: {
		  responsive: true,

/*
		  scales: {
			xAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'extension'
				}
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'force'
				}
			}]
		  }
*/
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
