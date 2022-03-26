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

export const GET_REVIEWS = gql`
  query getReviews($id: ID!) {
    product(id: $id) {
      reviews {
        id
        text
        rating
        createdAt
        user {
          username
        }
      }
    }
  }
`
