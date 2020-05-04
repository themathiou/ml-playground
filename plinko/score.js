const outputs = [];
const PREDICTION_POINT = 300;
const K = 3;

const distance = (point) => Math.abs(point - PREDICTION_POINT);
const mapDistanceBucket = (row) => [distance(row[0]), row[3]];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const bucket = _.chain(outputs)
    .map(mapDistanceBucket)
    .sortBy(row => row[0])
    .slice(0, K)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value()

  console.log('Your point will probably fall into: ', bucket);
}
