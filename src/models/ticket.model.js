import { Schema, model, Types } from "mongoose";

const schemaTicket = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProcess", "completed"],
      default: "pending",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", schemaTicket);

export default Ticket;
