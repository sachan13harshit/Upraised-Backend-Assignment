const {Router} = require('express');
const {userMiddleware} = require('../middleware/userMiddleWare');
const {
    getAllGadgets,
    createGadget,
    updateGadget,
    decommissionGadget,
    selfDestructGadget
  } = require('../controllers/gadgetController');

const router = Router();

router.get('/' , userMiddleware , getAllGadgets);
router.post('/' , userMiddleware , createGadget);
router.patch('/:id' , userMiddleware , updateGadget);
router.delete('/:id' , userMiddleware , decommissionGadget);
router.post('/:id/self-destruct' , userMiddleware , selfDestructGadget);

module.exports = router;