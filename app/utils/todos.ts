export const CONSTANTS = {
  COLLECTIONS: {
    BUSINESS: "business",
    PERSONAL: "personal",
    OTHER: "other"
  },
  TIME_PERIOD: {
    FIVE_SECONDS: 1000 * 5,
    THIRTY_SECONDS: 1000 * 30,
    TWENTY_FOUR_HOURS: 1000 * 60 * 60 * 24,
    TWO_DAYS: 1000 * 60 * 60 * 24 * 2,
    FIVE_DAYS: 1000 * 60 * 60 * 24 * 5
  }
};

export const collections = [
  CONSTANTS.COLLECTIONS.BUSINESS,
  CONSTANTS.COLLECTIONS.PERSONAL,
  CONSTANTS.COLLECTIONS.OTHER
];

export function createTodo({
  text,
  isCompleted = false,
  collection,
  isDeleted = false,
  userId
}) {
  return {
    text, // text of the todo
    isCompleted, // check box of todo
    createdTimestamp: Date.now(), // when todo is created
    collection,
    isDeleted,
    userId
  };
}
