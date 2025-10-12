export type GetBoardResCard = {
  id: string;
  text: string;
};

export type GetBoardResColumn = {
  id: string;
  name: string;
  cards: GetBoardResCard[];
};

export type GetBoardRes = {
  id: string;
  name: string;
  columns: GetBoardResColumn[];
};
