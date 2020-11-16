const schema = mongoose.Schema({
    userID: Number,
    warn: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", schema)