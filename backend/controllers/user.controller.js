import User from "../models/user.model.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const currectUser = await User.findById(req.user._id).select("-password");
    // find users who are not already connected, and also don't recommend our own profile!! right?
    const suggectedUser = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currectUser.connections,
      },
    })
      .select("name username profilePicture headline")
      .limit(3);

      res.json(suggectedUser);
  } catch (error) {
    console.error("Error in getSuggestedConnections controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found"});   
        }

        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name", 
            "headline", 
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        const updatedData = {};

        // name john doe
        for(const field of allowedFields){
            if(res.body[field]){
                updatedData[field] = req.body[field];
            }
        }

        // todo: check for the profileImg and bannerImg => uploaded to cloudinary

        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");  

        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }       
};