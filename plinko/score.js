const outputs = [];

// Calculate distance on n-dimensional space (many features)
// using Pythagorean Theorem
function distance(point, predictionPoint) {
  return _.chain(point)
    .zip(predictionPoint) // zip() take pairs if same index between point and predictionPoint
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5 // sqr root
}

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]); // available features
}

function runAnalysis() {
  const TEST_SET_SIZE = 200;
  const [testSet, trainingSet] = splitDataset(outputs, TEST_SET_SIZE);

  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3]) // use _.initial(testPoint) so no label is present
      .size()
      .divide(TEST_SET_SIZE)
      .value();

    console.log(`For k: ${k} accuracy is: ${accuracy}`);
  });

}

/**
 * 
 * @param {*} data : contains all features and label
 * @param {*} predictionPoint : contains all features BUT NO label
 * @param {*} k 
 */
function knn(data, predictionPoint, k) {
  return _.chain(data)
    .map((row) => [distance(_.initial(row), predictionPoint), _.last(row)])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value()
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

