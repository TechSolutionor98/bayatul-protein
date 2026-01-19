import mongoose from "mongoose"

const upgradeFeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const UpgradeFeature = mongoose.model("UpgradeFeature", upgradeFeatureSchema)

export default UpgradeFeature
