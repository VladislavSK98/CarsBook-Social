const router = require("express").Router();
const trackController = require("../controllers/trackController");
// const auth = require("../middlewares/auth");



// TRACKS
router.get("/", trackController.getAllTracks);
router.get("/:id", trackController.getTrackById);
router.post("/", trackController.addTrack);
router.post("/user", trackController.addTrackForUser);
router.put("/:id", trackController.updateTrack);
router.delete("/:id", trackController.deleteTrack);

// LAPS
router.post("/:trackId/lap", trackController.addLap);
router.delete("/:trackId/lap/:lapId", trackController.deleteLap);

module.exports = router;
