import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema } = pkg;

const options = { toJson: { virtuals: true }, toObject: { virtuals: true } };

const musicTracksSchema = new mongoose.Schema(
	{
		composer: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		year: {
			type: String,
			required: true,
		},
		instrument: {
			type: String,
		},
		length: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
		},
		harmony: {
			type: String,
		},
		rhythm: {
			type: String,
		},
		character: {
			type: String,
		},
		artistDescription: {
			type: String,
			required: true,
		},
		playListOrder: {
			type: Number,
			required: true,
		},
	},
	options
);

const trackCommentsSchema = new mongoose.Schema({
	track_id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
});

musicTracksSchema.virtual("comments", {
	ref: "TrackComment", // The model to use
	localField: "_id", // Find people where `localField`
	foreignField: "track_id", // is equal to `foreignField`
	// If `justOne` is true, 'members' will be a single doc as opposed to
	// an array. `justOne` is false by default.
	justOne: false,
});

export const MusicTrack = mongoose.model("MusicTrack", musicTracksSchema);
export const TrackComment = mongoose.model("TrackComment", trackCommentsSchema);
