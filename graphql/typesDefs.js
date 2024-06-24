module.exports = `#graphql
  type Recipe {
    name: String!
    description: String!
    createdAt: String!
    thumbsUp: Int!
    thumbsDown: Int!
  }

  input RecipeInput {
    name: String!
    description: String
  }

  type User {
    username: String!
    email:String!
    password: String!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Query {
    recipe(ID: ID!): Recipe!
    getRecipes(amount: Int): [Recipe!]!
    user(ID: ID!): User!
  }

  type Mutation {
    createRecipe(recipeInput: RecipeInput!): Recipe!
    updateRecipe(ID: ID!, recipeInput: RecipeInput!): Boolean
    deleteRecipe(ID: ID!): Boolean
    registerUser(registerInput: RegisterInput!) : User!
    loginUser(loginInput: LoginInput!) : User!
  }
`;
