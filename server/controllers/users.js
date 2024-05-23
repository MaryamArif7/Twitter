import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    //req.params to extract route parameters such as the user ID
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    //User->Modal
    //->id is the id extracted from the params
    const user = await User.findById(id);
    //promise.all takes an arry of promises which are returned by the id of the user 
    //and returns a single promise whehn all oll of the input promises have been resolved
    //then await waits for all the all the promises and ssins the value to the frieds 

    const friends = await Promise.all(
      /*the user =>obj,is the which we got from the db of User after finding it by id 
     -> user has proptery of freinds->a  array->value in the User
      ->map is a fun which creates a new array by applying a function to
      ->ech eelemnt of the orignal array 
     -> then user.friends ->are friends Ids
     -> then map apllied the function to them
     -> (id)=>User.findById(id) this is an arraow function that takes one agument->id
     ->and returns the result of User.findByid(id)
     ->this function is applied to each Id in the user.friends array
     basically:
     code takes the friends array from the user object, 
     which contains friend IDs,
      and uses map to transform each ID into a user object 
     by fetching it from the database using User.findById(id).
     ->transforming ecah ID into a user object:
     ->databse call for each elemnt in the frinds array 
     call bcak function is the databse query here 
     amd we are  not  disrectly converting them into user objs,but
     returning an array of promise 
      */
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { _id, friendId } = req.params;
    const user = await User.findById(_id);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== _id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(_id);
    }

    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
