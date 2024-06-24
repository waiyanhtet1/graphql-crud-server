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

  type Query {
    recipe(ID: ID!): Recipe!
    getRecipes(amount: Int): [Recipe!]!
  }

  type Mutation {
    createRecipe(recipeInput: RecipeInput!): Recipe!
    updateRecipe(ID: ID!, recipeInput: RecipeInput!): Boolean
    deleteRecipe(ID: ID!): Boolean
  }
`;
