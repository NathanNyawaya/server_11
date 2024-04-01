import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const updateEventListAndPropagate = async (req, res) => {
    try {
        console.log("Attempting to update user event list and propagate changes...");

        // Verify and extract token from request headers
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log("Unauthorized: Token not provided.");
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Decode token to extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch admin user from database
        const adminUser = await User.findById(decoded.id);
        if (!adminUser) {
            console.log("Admin user not found in the database.");
            return res.status(404).json({ message: "No admin User" });
        }

        // Extract user ID and event list from request body
        const { user_id, event_list } = req.body;
        if (!user_id || !event_list) {
            console.log("Invalid request: User ID or event list missing.");
            return res.status(400).json({ message: "User ID and event list are required" });
        }

        // Fetch user to be edited from database
        const userToEdit = await User.findById(user_id);
        if (!userToEdit) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "No user found" });
        }

        console.log(`Editing event list for user: ${userToEdit.username}, Role: ${userToEdit.role}`);

        // Update the event list for the user being edited
        userToEdit.eventList = event_list;
        await userToEdit.save();

        console.log("Event list updated successfully for user:", userToEdit.username);

        // Function to recursively update event lists for child users
        const updateChildEventLists = async (user) => {
            for (const childId of user.children) {
                const child = await User.findById(childId);
                if (child) {
                    // Update event list for child user
                    child.eventList = event_list;
                    await child.save();
                    console.log(`Event list updated for child user: ${child.username}, Role: ${child.role}`);
                    // Recursively update event lists for child's children
                    await updateChildEventLists(child);
                    console.log("propagating ------")
                }
            }
        };

        // Recursively update event lists for all child users
        await updateChildEventLists(userToEdit);

        // Respond with success message and updated event list snapshot
        res.status(200).json({ message: "User Event List Modified Success", statusCode: 200, snapshot: userToEdit.eventList });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
