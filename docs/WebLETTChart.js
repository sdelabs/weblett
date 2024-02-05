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
			label: "Resistance\n (only on some LETTs)",
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
        			text: 'displacement'
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
        			text: 'value'
      			}
    		}
		}
	}});
