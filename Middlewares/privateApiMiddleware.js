const verify = async (req, res, next) => {
    const { apiKey } = req.body;

    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        return res.json({
            status: "error",
            error: "API key invalid",
        });
    }
};

module.exports = {
    verify,
};
