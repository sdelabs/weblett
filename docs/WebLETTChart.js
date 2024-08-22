var myChart = new Chart(document.getElementById("myChart"), {
	type: 'scatter',
	data: {
		datasets: [{
			label: "Force vs Displacement",
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
			label: ["Resistance", "(only on some LETTs)"],
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
/*		scales: {
			xAxes: [{
			// type: 'linear', 
			scaleLabel: {
				display: true,
				labelString: 'displacement [mm]',
			}
			}],
			yAxes: [{
			//type: 'linear', 
			scaleLabel: {
				display: true,
				labelString: 'force [N]'
			}
			}]
		}
	}
 */
		scales: {
    		x: {
      			//type: 'time',
      			type: 'linear',
      			display: true,
      			title: {
        			display: true,
        			text: 'displacement [mm]'
      			},
	      		ticks: {
	        		major: {
	          			enabled: true
	        		},
		        	color: (context) => context.tick && context.tick.major && '#FF0000',
		        	font: function(context) {
			          	if (context.tick && context.tick.major) {
			            		return {
			              			weight: 'bold'
			            		};
			          	}
			        }
	      		}
    		},
    		y: {
      			display: true,
      			title: {
        		display: true,
        			text: 'force [N]'
      			}
    		}
		} // scales
	}
});

function rbAxisClicked() {
	if (debug) console.log("rBaxis Clicked")
	if (frcRadio.checked) {	myChart.options.scales.y.title.text=frcRadio.value }
	if (resRadio.checked) {	myChart.options.scales.y.title.text=resRadio.value }
	if (tempRadio.checked) {myChart.options.scales.y.title.text=tempRadio.value}

	if (timeRadio.checked) { myChart.options.scales.x.title.text=timeRadio.value }
	if (displaceRadio.checked) { myChart.options.scales.x.title.text=displaceRadio.value }

	// hide everything
	myChart.data.datasets[0].hidden = true
	myChart.data.datasets[1].hidden = true
	myChart.data.datasets[2].hidden = true

	// show the selected
	if (frcRadio.checked & displaceRadio.checked)	myChart.data.datasets[0].hidden = false
	if (frcRadio.checked & timeRadio.checked)		myChart.data.datasets[1].hidden = false
	if (resRadio.checked & displaceRadio.checked)	myChart.data.datasets[2].hidden = false

	// and showtime
	myChart.update()
}
