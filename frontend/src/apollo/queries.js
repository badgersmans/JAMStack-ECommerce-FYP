import { gql } from "@apollo/client"

export const GET_DETAILS = gql`
  query getDetails($id: ID!) {
    product(id: $id) {
      product_variants {
        quantity
      }
    }
  }
`
