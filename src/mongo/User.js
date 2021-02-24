const schema = mongoose.Schema({
    userID: String,
    warn: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", schema)