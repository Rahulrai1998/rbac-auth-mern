import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { page: pg, limit: lt } = req.query;
    const page = parseInt(pg) || 1;
    const limit = parseInt(lt) || 2;
    const skip = (page - 1) * limit;
    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / limit);
    const requestedUsers = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password");
    res.status(200).json({
      users: requestedUsers,
      totalUsersCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server error." });
  }
};

/*
req.query: key-value pair from query strings 
req.params: dynamic params
req.body: key-value pair from request body.

parseInt() vs Number() typecasting: parseInt()
Number("16px"): NaN while parseInt("16px"): 16, parses from left to right.

select("-password"): it is a mongoose method used to include or exclude fields from the query results. In this case, password field will omitted from the targetted result.

skip() and limit() methods: 

Math.ceil(1.2) = 2, returns the smallest integer greater than or equal to the passed number.
*/
