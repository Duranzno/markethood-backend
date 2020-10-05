// require("dotenv").config();

import { getApolloConfig, setupServer } from "./graphql"

async function run() {
  try {
    const config = getApolloConfig()
    setupServer(config)
  } catch (error) {
    console.error(error)
  }
}
run()
