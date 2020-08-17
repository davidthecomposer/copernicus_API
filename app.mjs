import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import { MusicTrack, TrackComment } from "./models/musicTracks.mjs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.options("*", cors());

const connectAndListen = async () => {
	const localLinkToDB = "mongodb://localhost:27017/copernicusDB";

	try {
		await mongoose.connect(process.env.DB_URI || localLinkToDB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		app.listen(process.env.PORT || 8080, () => {
			console.log(`server started on port 8080.`);
		});
	} catch (err) {
		console.log(err);
	}
};

connectAndListen();

app.route("/").get((req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

app.route("/tracks").get((req, res) => {
	MusicTrack.find({})
		.populate("comments")

		.exec((err, trackInfo) => {
			if (err) {
				res.json(err);
			} else {
				res.json(trackInfo.map((item) => item.toObject()));
			}
		});
});

app.route("/tracks/:trackTitle").get((req, res) => {
	const trackTitle = req.params.trackTitle;
	MusicTrack.findOne({ title: trackTitle })
		.populate("comments")
		.exec((err, trackInfo) => {
			if (err) {
				res.json(err);
			} else {
				res.json(trackInfo.toObject({ virtuals: true }));
			}
		});
});

app.route("/tracks/:trackTitle/comments").post((req, res) => {
	const data = req.body;
	TrackComment.create(
		{
			track_id: data.track_id,
			name: data.name,
			comment: data.comment,
			timestamp: data.timestamp,
		},
		(err) => {
			if (err) {
				res.json(err);
			} else {
				res.json("comment submitted");
			}
		}
	);
});

app.route("/tracks/:trackTitle/comments/:commentID").delete((req, res) => {
	const commentID = req.params.commentID;
	const clientPassword = req.body.password;
	const serverPassword = "apples";
	if (clientPassword === serverPassword) {
		TrackComment.findByIdAndDelete(commentID, (err) => {
			if (err) {
				res.json(err);
			} else {
				res.json(`Comment deleted `);
			}
		});
	} else {
		res.json("incorrect admin password");
	}
});
