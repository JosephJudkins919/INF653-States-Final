const data = require('../models/statesData.json');

const states = data.map((state) => {
  return state.code;
});

const abbrevHandler = (req, res, next) => {
  const state = states.includes(req.params.state.toUpperCase());
  if (!state) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  next();
};

module.exports = abbrevHandler;
