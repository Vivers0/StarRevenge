const schema = mongoose.Schema({
    warnID: Number,
    userID: Number,
    reason: String,
    moderatorID: String,
    time: {type: Date, default: Date.now()},
});

module.exports = mongoose.model("Warn", schema)