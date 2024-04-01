import User from "../../models/User.js";
import bcrypt from "bcrypt";

const eventsList_01 = ["Cricket", "Football", "Tennis", "Basketball", "Esports", "Darts", "Volleyball", "Gaelic Games", "Mixed Martial Arts", "Horse Racing", "Horse Racing - Today's Card", "Greyhound Racing", "Greyhounds - Today's Card", "Politics", "Rugby Union", "Rugby League", "Boxing", "Baseball", "Golf", "Motor Sport", "All Casino", "Virtual Games"]

// To run when the app is installed, Done once otherwise change username and email to prevent DUPLICATE ERRORS!
export const createSystemControlUser = async () => {
    try {
        // Create a new system control user
        const systemControlUser = new User({
            fullName: "System Control",
            username: "SC-01",
            email: "grenlyfe@example.com",
            password: await bcrypt.hash("145236", 10),
            role: "systemControl",
            balance: 500000,
            availableBalance: 500000,
            creditRef: 500000,
            partnership: 100,
            eventList: eventsList_01
        });

        // Save the system control user to the database
        await systemControlUser.save();

        console.log("System control user created successfully!");
    } catch (error) {
        console.error("Error creating system control user:", error);
    }
}