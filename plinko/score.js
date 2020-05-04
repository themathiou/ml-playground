const outputs = [];
const K = 3;

const distance = (point, predictionPoint) => Math.abs(point - predictionPoint);

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const TEST_SET_SIZE = 10;
  const [testSet, trainingSet] = splitDataset(outputs, TEST_SET_SIZE);

  let successCounter = 0;
  testSet.forEach((set) => {
    const bucket = knn(trainingSet, set[0]);
    bucket === set[3] && successCounter++;
  });

  console.log('Accuracy: ', successCounter / TEST_SET_SIZE);
}

function knn(data, predictionPoint) {
  return _.chain(data)
    .map((row) => [distance(row[0], predictionPoint), row[3]])
    .sortBy(row => row[0])
    .slice(0, K)
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

