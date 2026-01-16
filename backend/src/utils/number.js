/**
 * Parse decimals safely from Sequelize DECIMAL strings.
 * @param {string|number|null|undefined} value
 */
function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

module.exports = { toNumber };
