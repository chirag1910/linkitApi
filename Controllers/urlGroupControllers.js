const UrlGroup = require("../Models/urlGroupModel");
const Url = require("../Models/urlModel");
const shorten = require("nanoid").customAlphabet;
const ObjectId = require("mongoose").Types.ObjectId;

const addUrlGroup = async (req, res) => {
    const { userID, title, public } = req.body;

    if (!title) {
        return res.json({ status: "error", error: "Invalid title" });
    }

    try {
        var groupID = shorten(new ObjectId().toString(), 6)();

        while (await UrlGroup.findOne({ groupID })) {
            groupID = shorten(new ObjectId().toString(), 6)();
        }

        const urlGroup = await UrlGroup.create({
            userID,
            groupID,
            title,
            public,
        });

        return res.json({
            status: "ok",
            groupID: urlGroup.groupID,
            title: urlGroup.title,
            public: urlGroup.public,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteUrlGroup = async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        const urlGroup = await UrlGroup.findOne({ userID, groupID });

        if (urlGroup) {
            const urls = await Url.find({ userID, groupID });

            urls.forEach(async (url) => {
                await url.remove();
            });

            await urlGroup.remove();

            return res.json({
                status: "ok",
                message: "Group deleted successfully",
            });
        } else {
            return res.json({ status: "error", error: "Invalid group ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteUrlGroups = async (req, res) => {
    const { userID } = req.body;

    try {
        const urlGroups = await UrlGroup.find({ userID });

        urlGroups.forEach(async (urlGroup) => {
            const urls = await Url.find({ userID, groupID: urlGroup.groupID });

            urls.forEach(async (url) => {
                await url.remove();
            });

            await urlGroup.remove();
        });

        return res.json({
            status: "ok",
            message: "Groups deleted successfully",
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const updateUrlGroup = async (req, res) => {
    const { userID, groupID, title, public } = req.body;

    try {
        const urlGroup = await UrlGroup.findOne({ userID, groupID });

        if (urlGroup) {
            await urlGroup.updateOne({
                title,
                public,
            });

            return res.json({
                status: "ok",
                groupID: urlGroup.groupID,
                title,
                public,
            });
        } else {
            return res.json({ status: "error", error: "Invalid group ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getUrlGroup = async (req, res) => {
    const { userID, groupID } = req.body;
    try {
        const urlGroup = await UrlGroup.findOne({ userID, groupID });

        if (urlGroup) {
            const urls = await Url.find({ userID, groupID });

            return res.json({
                status: "ok",
                groupID: urlGroup.groupID,
                title: urlGroup.title,
                public: urlGroup.public,
                urls,
            });
        } else {
            return res.json({ status: "error", error: "Invalid group ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getUrlGroups = async (req, res) => {
    const { userID } = req.body;

    try {
        const urlGroups = await UrlGroup.find({ userID });

        return res.json({
            status: "ok",
            groups: urlGroups,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const publicGetUrlGroup = async (req, res) => {
    const { groupID } = req.body;
    try {
        const urlGroup = await UrlGroup.findOne({ groupID });

        if (urlGroup) {
            if (urlGroup.public) {
                const urls = await Url.find({ groupID });

                return res.json({
                    status: "ok",
                    groupID: urlGroup.groupID,
                    title: urlGroup.title,
                    public: urlGroup.public,
                    urls,
                });
            } else {
                return res.json({ status: "error", error: "Group private" });
            }
        } else {
            return res.json({ status: "error", error: "Invalid group ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

module.exports = {
    addUrlGroup,
    deleteUrlGroup,
    deleteUrlGroups,
    updateUrlGroup,
    getUrlGroup,
    getUrlGroups,
    publicGetUrlGroup,
};
