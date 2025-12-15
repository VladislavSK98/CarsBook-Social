const router = require("express").Router();
const tracksController = require("../controllers/trackController");

router.get("/", tracksController.getAllTracks);
router.get("/:id", tracksController.getTrackById);
// router.post("/", tracksController.createTrack);
router.put("/:id", tracksController.updateTrack);
router.delete("/:id", tracksController.deleteTrack);
router.post("/", tracksController.addTrack);
router.post("/user", tracksController.addTrackForUser);
router.post("/:id/lap", tracksController.addLap);
router.post('/:id/laps', tracksController.addLap);

// POST /api/tracks/:trackId/lap
router.post("/:trackId/lap", async (req, res) => {
  try {
    const { trackId } = req.params;
    const { user, car, time, condition } = req.body;

    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const lap = {
      user,
      car,
      time,
      condition,
    };

    track.fastestLaps.push(lap);

    // сортиране по време
    track.fastestLaps.sort((a, b) => a.time - b.time);

    await track.save();

    // връщаме последно добавената обиколка (populated)
    const populatedTrack = await Track.findById(trackId)
      .populate("fastestLaps.user", "username")
      .populate("fastestLaps.car", "make model power");

    const addedLap =
      populatedTrack.fastestLaps[populatedTrack.fastestLaps.length - 1];

    res.status(201).json(addedLap);
  } catch (err) {
    console.error("Add lap error:", err);
    res.status(500).json({ message: "Failed to add lap" });
  }
});

// DELETE /api/tracks/:trackId/lap/:lapId
router.delete("/:trackId/lap/:lapId", async (req, res) => {
  try {
    const { trackId, lapId } = req.params;
    const userId = req.user._id;

    const track = await Track.findById(trackId);
    if (!track) return res.status(404).json({ message: "Track not found" });

    const lap = track.fastestLaps.id(lapId);
    if (!lap) return res.status(404).json({ message: "Lap not found" });

    if (lap.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    lap.remove();
    await track.save();

    res.json({ message: "Lap deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});




module.exports = router;
