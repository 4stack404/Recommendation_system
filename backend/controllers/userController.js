import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const {userID} = req.body;
    

    const user = await userModel.findById(userID);

    if(!user) {
        return res.status(404).json({success: false, message: "User not found"});
    }

    res.json({
        success: true,
        userData: {
            name: user.name,
            isAccountVerified: user.isAccountVerified,  
        }
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
