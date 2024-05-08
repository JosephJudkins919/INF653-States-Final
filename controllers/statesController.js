const StateModel = require('../models/State');

const dataObj = {
  statesData: require('../models/statesData.json'),
  updateStates: function (data) {
    this.statesData = data;
  },
};

const fetchAllStates = async (req, res) => {
  let allStates = dataObj.statesData;

  try {
    const mongoState = await StateModel.find().exec();
    for (let i = 0; i < allStates.length; i++) {
      const state = mongoState.find(
        (state) => state.stateCode === allStates[i].code
      );
      if (state !== undefined) {
        allStates[i].funfacts = [];
        allStates[i].funfacts.push(...state.funfacts);
      }
    }
    res.json(allStates);
  } catch (err) {
    console.error(err);
  }
};

const fetchState = async (req, res) => {
  const stateInfo = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!stateInfo) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  try {
    const dbState = await StateModel.findOne({
      stateCode: stateInfo.code,
    }).exec();

    if (dbState) {
      stateInfo.funfacts = [];
      for (let index = 0; index < dbState.funfacts.length; index++) {
        stateInfo.funfacts.push(dbState.funfacts[index]);
      }
    }
    res.json(stateInfo);
  } catch (error) {
    console.error(error);
  }
};

const fetchStateNickName = async (req, res) => {
  const stateInfo = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!stateInfo) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  res.json({ state: `${stateInfo.state}`, nickname: `${stateInfo.nickname}` });
};

const fetchStateCapital = async (req, res) => {
  const stateInfo = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!stateInfo) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  res.json({
    state: `${stateInfo.state}`,
    capital: `${stateInfo.capital_city}`,
  });
};

const fetchStatePopulation = async (req, res) => {
  const stateInfo = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!stateInfo) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  res.json({
    state: `${stateInfo.state}`,
    population: `${stateInfo.population
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
  });
};

const fetchStateAdmission = async (req, res) => {
  const state = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }
  res.json({ state: `${state.state}`, admitted: `${state.admission_date}` });
};

const retrieveFunFact = async (req, res) => {
  const userState = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!userState) {
    return res
      .status(400)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  const state = await StateModel.findOne({ stateCode: userState.code }).exec();
  if (state) {
    const funFactLength = state.funfacts.length;
    const randomIndex = Math.floor(Math.random() * funFactLength);
    res.json({ funfact: `${state.funfacts[randomIndex]}` });
  } else {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${userState.state}` });
  }
};

const addNewState = async (req, res) => {
  if (!req?.body?.funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  if (!Array.isArray(req.body.funfacts)) {
    return res
      .status(400)
      .json({ message: 'State fun facts value must be an array' });
  }

  try {
    const state = await StateModel.findOne({
      stateCode: req.params.state.toUpperCase(),
    }).exec();
    if (!state) {
      const result = await StateModel.create({
        stateCode: req.params.state.toUpperCase(),
        funfacts: req.body.funfacts,
      });
      res.status(201).json(result);
    } else {
      const result = await StateModel.findOneAndUpdate(
        {
          stateCode: req.params.state.toUpperCase(),
        },
        {
          $push: { funfacts: req.body.funfacts },
        },
        { new: true }
      );
      res.status(201).json(result);
    }
  } catch (error) {
    console.error(error);
  }
};

const modifyState = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }
  if (!req?.body?.funfact) {
    return res.status(400).json({ message: 'State fun fact value required' });
  }

  const funFactsIndex = req.body.index - 1;
  const state = await StateModel.findOne({
    stateCode: req.params.state.toUpperCase(),
  }).exec();
  const stateJSONData = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (state?.funfacts === undefined) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateJSONData.state}` });
  }
  if (req.body.index > state.funfacts.length) {
    return res.status(404).json({
      message: `No Fun Fact found at that index for ${stateJSONData.state}`,
    });
  }

  state.funfacts.splice(funFactsIndex, 1);
  state.funfacts.splice(funFactsIndex, 0, req.body.funfact[0]);

  const result = await StateModel.findOneAndUpdate(
    {
      stateCode: req.params.state.toUpperCase(),
    },
    {
      funfacts: state.funfacts,
    },
    { new: true }
  );
  res.status(201).json(result);
};

const removeFunFact = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }

  const funFactsIndex = req.body.index - 1;

  const state = await StateModel.findOne({
    stateCode: req.params.state.toUpperCase(),
  }).exec();
  const stateJSONData = dataObj.statesData.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  if (state?.funfacts === undefined) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateJSONData.state}` });
  }

  if (req.body.index > state.funfacts.length) {
    return res.status(404).json({
      message: `No Fun Fact found at that index for ${stateJSONData.state}`,
    });
  }
  state.funfacts.splice(funFactsIndex, 1);

  const result = await StateModel.findOneAndUpdate(
    {
      stateCode: req.params.state.toUpperCase(),
    },
    {
      funfacts: state.funfacts,
    },
    { new: true }
  );
  res.status(201).json(result);
};

module.exports = {
  fetchAllStates,
  fetchState,
  fetchStateNickName,
  fetchStateCapital,
  fetchStatePopulation,
  fetchStateAdmission,
  retrieveFunFact,
  addNewState,
  modifyState,
  removeFunFact,
};
