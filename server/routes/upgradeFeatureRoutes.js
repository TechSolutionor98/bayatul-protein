import express from "express"
import UpgradeFeature from "../models/upgradeFeatureModel.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @desc    Get all upgrade features (optionally filtered by active status)
// @route   GET /api/upgrade-features
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { active } = req.query
    const query = active === "true" ? { active: true } : {}

    const features = await UpgradeFeature.find(query).sort({ order: 1 })
    res.json(features)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Get single upgrade feature
// @route   GET /api/upgrade-features/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const feature = await UpgradeFeature.findById(req.params.id)
    if (feature) {
      res.json(feature)
    } else {
      res.status(404).json({ message: "Upgrade feature not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Create upgrade feature
// @route   POST /api/upgrade-features
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const feature = new UpgradeFeature(req.body)
    const createdFeature = await feature.save()
    res.status(201).json(createdFeature)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// @desc    Update upgrade feature
// @route   PUT /api/upgrade-features/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const feature = await UpgradeFeature.findById(req.params.id)

    if (feature) {
      Object.assign(feature, req.body)
      const updatedFeature = await feature.save()
      res.json(updatedFeature)
    } else {
      res.status(404).json({ message: "Upgrade feature not found" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// @desc    Delete upgrade feature
// @route   DELETE /api/upgrade-features/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const feature = await UpgradeFeature.findById(req.params.id)

    if (feature) {
      await feature.deleteOne()
      res.json({ message: "Upgrade feature removed" })
    } else {
      res.status(404).json({ message: "Upgrade feature not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
