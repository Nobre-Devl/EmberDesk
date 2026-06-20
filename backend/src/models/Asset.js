import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["computer", "monitor", "printer", "server", "router", "other"],
      default: "computer",
    },
    serialNumber: {
      type: String,
      trim: true,
      default: null,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: null,
    },
    macAddress: {
      type: String,
      trim: true,
      default: null,
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["operational", "maintenance", "retired"],
      default: "operational",
    },
    clientToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
