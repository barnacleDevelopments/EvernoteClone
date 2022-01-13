module.exports = function getCentenaryOfYears() {
  const todaysDate = new Date();
  const aCentenaryAgo = new Date();
  aCentenaryAgo.setFullYear(todaysDate.getFullYear() - 100);
  let inBetweenDate = aCentenaryAgo;
  let aCentenaryOfYears = [];
  while (inBetweenDate < todaysDate) {
    inBetweenDate.setFullYear(inBetweenDate.getFullYear() + 1)
    aCentenaryOfYears.push(inBetweenDate.getFullYear());
  }
  return aCentenaryOfYears
}

