const form = 1 + Math.pow(10, playerTwo.rank - playerOne.rank / 400);
const probability = 1 / (1 + Math.pow(10, playerTwo.rank - playerOne.rank / 400))
const newRating = playerOne + 32( 1 - probability )

