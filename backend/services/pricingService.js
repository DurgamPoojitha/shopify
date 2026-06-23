/**
 * Hardcoded pricing rules based on ZIP code.
 */
function getPriceByZip(zipCode) {
  switch (zipCode) {
    case '75028':
      return 1499;
    case '10001':
      return 1699;
    case '90210':
      return 1799;
    default:
      return 1399; // Default price
  }
}

module.exports = {
  getPriceByZip
};
