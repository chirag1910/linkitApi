const Url = require("../Models/urlModel");
const shorten = require("nanoid").customAlphabet;
const ObjectId = require("mongoose").Types.ObjectId;
const isUrl = require("../Utils/validateUrl");

const addUrl = async (req, res) => {
    const { userID, groupID, title, fullUrl } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }
    if (!title) {
        return res.json({ status: "error", error: "Invalid title" });
    }
    if (!fullUrl || !isUrl(fullUrl)) {
        return res.json({ status: "error", error: "Invalid URL" });
    }

    try {
        var urlID = shorten(new ObjectId().toString(), 6)();

        while (await Url.findOne({ urlID })) {
            urlID = shorten(new ObjectId().toString(), 6)();
        }

        const url = await Url.create({
            userID,
            groupID,
            urlID,
            title,
            fullUrl,
        });

        return res.json({
            status: "ok",
            groupID: url.groupID,
            urlID: url.urlID,
            title: url.title,
            fullUrl: url.fullUrl,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteUrl = async (req, res) => {
    const { userID, groupID, urlID } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }
    if (!urlID) {
        return res.json({ status: "error", error: "Invalid url ID" });
    }

    try {
        const url = await Url.findOne({ userID, groupID, urlID });

        if (url) {
            url.remove();

            return res.json({
                status: "ok",
                message: "Url deleted successfully",
            });
        } else {
            return res.json({
                status: "error",
                error: "Invalid group or url ID",
            });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteUrls = async (req, res) => {
    const { userID, groupID } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }

    try {
        const urls = await Url.find({ userID, groupID });

        urls.forEach(async (url) => {
            await url.remove();
        });

        return res.json({
            status: "ok",
            message: "Urls deleted successfully",
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const updateUrl = async (req, res) => {
    const { userID, groupID, urlID, title, fullUrl } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }
    if (!urlID) {
        return res.json({ status: "error", error: "Invalid url ID" });
    }
    if (fullUrl && !isUrl(fullUrl)) {
        return res.json({ status: "error", error: "Invalid url" });
    }

    try {
        const url = await Url.findOne({ userID, groupID, urlID });

        if (url) {
            await url.updateOne({
                title,
                fullUrl,
            });

            return res.json({
                status: "ok",
                groupID: url.groupID,
                urlID: url.urlID,
                title,
                fullUrl,
            });
        } else {
            return res.json({
                status: "error",
                error: "Invalid group or url ID",
            });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getUrl = async (req, res) => {
    const { userID, groupID, urlID } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }
    if (!urlID) {
        return res.json({ status: "error", error: "Invalid url ID" });
    }

    try {
        const url = await Url.findOne({ userID, groupID, urlID });

        if (url) {
            return res.json({
                status: "ok",
                groupID: url.groupID,
                urlID: url.urlID,
                title: url.title,
                fullUrl: url.fullUrl,
            });
        } else {
            return res.json({
                status: "error",
                error: "Invalid group or url ID",
            });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getUrls = async (req, res) => {
    const { userID, groupID } = req.body;

    if (!groupID) {
        return res.json({ status: "error", error: "Invalid group ID" });
    }

    try {
        const urls = await Url.find({ userID, groupID });

        return res.json({
            status: "ok",
            urls,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getTotalUrlsCount = async (req, res) => {
    const { userID } = req.body;

    try {
        const count = await (await Url.find({ userID })).length;

        return res.json({
            status: "ok",
            count,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getTotalUrlsVisits = async (req, res) => {
    const { userID } = req.body;

    try {
        const urls = await Url.find({ userID });

        var visits = 0;
        urls.forEach((url) => {
            visits += url.visits;
        });

        return res.json({
            status: "ok",
            visits,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const publicGetUrl = async (req, res) => {
    const { urlID } = req.body;

    if (!urlID) {
        return res.json({ status: "error", error: "Invalid url ID" });
    }

    try {
        const url = await Url.findOne({ urlID });

        await url.updateOne({ visits: url.visits + 1 });

        if (url) {
            return res.json({
                status: "ok",
                urlID: url.urlID,
                title: url.title,
                fullUrl: url.fullUrl,
            });
        } else {
            return res.json({ status: "error", error: "Invalid url ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

module.exports = {
    addUrl,
    deleteUrl,
    deleteUrls,
    updateUrl,
    getUrl,
    getUrls,
    getTotalUrlsCount,
    getTotalUrlsVisits,
    publicGetUrl,
};
