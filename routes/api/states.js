const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const abbrevCheck = require('../../middleware/abbrevHandler');

router.route('/').get(statesController.fetchAllStates);

router.route('/:state').get(statesController.fetchState);

router.route('/:state/nickname').get(statesController.fetchStateNickName);

router.route('/:state/admission').get(statesController.fetchStateAdmission);

router.route('/:state/population').get(statesController.fetchStatePopulation);

router.route('/:state/capital').get(statesController.fetchStateCapital);

router.route('/:state/funfact').get(statesController.retrieveFunFact);

router.route('/:state/funfact').post(statesController.addNewState);

router.route('/:state/funfact').patch(statesController.modifyState);

router.route('/:state/funfact').delete(statesController.removeFunFact);

module.exports = router;
