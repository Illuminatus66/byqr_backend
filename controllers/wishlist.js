import User from '../models/User.js';

export const addToWishlist = async (req, res) => {
  const { _id } = req.body;
  const { pr_id } = req.params;

  try {
    const user = await User.findById(_id);

    user.wishlist.push(pr_id.toString());

    await user.save();
    res.status(200).json({ message: 'Product added to wishlist'});
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { _id } = req.body;
  const { pr_id } = req.params;

  try {
    const user = await User.findById(_id);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== pr_id);

    await user.save();
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
