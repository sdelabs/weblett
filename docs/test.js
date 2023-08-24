var dataPoint = {
  timestamp: 0,
  position: 0.0,
  force: 0.0,
  resistance: 0.0,
  temperature: 0.0
};

var dataSet = []

function testClicked() {
	console.log('test clicked')
		console.log('dataPoint', dataPoint)
		console.log('dataSet', dataSet)
		dataSet.push(dataPoint)
		console.log('dataSet', dataSet)
		dataPoint.position=2.21
		dataPoint.force=2.22
		dataPoint.temperature=2.23
		dataSet.push(dataPoint)
		console.log('dataSet', dataSet)
}