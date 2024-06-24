const { GraphQLError } = require("graphql");
const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    async recipe(_, { ID }) {
      return await Recipe.findById(ID);
    },

    async getRecipes(_, { amount }) {
      return await Recipe.find().sort({ createdAt: -1 }).limit(amount);
    },

    async user(_, { ID }) {
      return await User.findById(ID);
    },
  },

  Mutation: {
    async createRecipe(_, { recipeInput: { name, description } }) {
      // create new recipe according to mongoose model
      const createdRecipe = new Recipe({
        name,
        description,
        createdAt: new Date().toISOString(),
        thumbsUp: 0,
        thumbsDown: 0,
      });

      // save to mongodb
      const res = await createdRecipe.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },

    async deleteRecipe(_, { ID }) {
      const wasDeleted = (await Recipe.deleteOne({ _id: ID })).deletedCount;

      // if something deleted return 1 or not return 0
      return wasDeleted;
    },

    async updateRecipe(_, { ID, recipeInput: { name, description } }) {
      const wasEdited = (
        await Recipe.updateOne(
          { _id: ID },
          { name: name, description: description }
        )
      ).modifiedCount;

      // if something updated return 1 or not return 0
      return wasEdited;
    },

    async registerUser(_, { registerInput: { username, email, password } }) {
      // check if user with email exit
      const isUserExit = await User.findOne({ email });

      // throw error if user exit
      if (isUserExit)
        throw new GraphQLError("User is already registered", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // encrypt input password
      const hashPassword = await bcrypt.hash(password, 10);

      // build new user model
      const newUser = new User({
        username,
        email,
        password: hashPassword,
      });

      // create jwt token for user model && attach to newUser model
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.SECRET_JWT,
        { expiresIn: "1d" }
      );
      newUser.token = token;

      // save into database
      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },

    async loginUser(_, { loginInput: { email, password } }) {
      // check is user exit with email
      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError("No User found with this email", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // compare input password and hashed password
      if (user && (await bcrypt.compare(password, user.password))) {
        // create new token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.SECRET_JWT,
          { expiresIn: "1d" }
        );

        // attach token to user model found from exited user
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        // return if not user found
        throw new GraphQLError("Incorrect Password", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    },
  },
};
