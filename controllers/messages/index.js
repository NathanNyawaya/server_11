import HomeMessage from "../../models/exchange/messages/HomeMessage.js"
export const saveMessage = async (req, res, next) => {
    try {
        console.log("hitting add msg")
        const { message } = req.body
        if (message) {
            const storedDoc = await HomeMessage.findOne()
            if (storedDoc) {
                storedDoc.message = message
                await storedDoc.save()
                res.status(200).json({ message: "Message saved success" });
                return
            } else {
                const newMsgDoc = new HomeMessage({
                    message: message
                })
                await newMsgDoc.save()
                res.status(200).json({ message: "Message saved success" });
                return
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error. Please contact support if the error persists.",
        });
    }
};


export const getAllMessages = async (req, res, next) => {
    try {
        const messages = await HomeMessage.find()
        if (messages) {
            res.status(200).json(messages);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error. Please contact support if the error persists.",
        });
    }
};

export const editMessage = async (req, res, next) => {
    try {
        console.log("hitting edit msg")
        const { message, messageId } = req.body
        if (message) {
            const storedDoc = await HomeMessage.findOne()
            if (storedDoc) {
                storedDoc.message = message
                await storedDoc.save()
                res.status(200).json({ message: "Message edit success" });
                return
            } else {
                res.status(404).json({ message: "Document not found" });
                return
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error. Please contact support if the error persists.",
        });
    }
};


export const deleteMessage = async (req, res, next) => {
    try {
        console.log("hitting edit msg")
        const { message, messageId } = req.body
        if (message && messageId) {
            const response = await HomeMessage.findOneAndDelete({ _id: messageId })
            if (response) {
                res.status(200).json({ message: "Message deleted success" });
                return
            } else {
                res.status(404).json({ message: "Document not found" });
                return
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error. Please contact support if the error persists.",
        });
    }
};
