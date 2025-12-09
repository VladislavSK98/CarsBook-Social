const router = require("express").Router();
const tracksController = require("../controllers/trackController");

router.get("/", tracksController.getAllTracks);
router.get("/:id", tracksController.getTrackById);
router.post("/", tracksController.createTrack);
router.put("/:id", tracksController.updateTrack);
router.delete("/:id", tracksController.deleteTrack);
router.post("/", tracksController.addTrack);


module.exports = router;
