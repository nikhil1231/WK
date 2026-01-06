import type {
  BallEntry,
  BowlerType,
  CollectionDifficulty,
  DeliveryPosition,
  ErrorReason,
  SelectionState,
  TakeResult,
  ThrowInResult,
} from "../../common/types";

export const selectionStateToBallEntry = (
  selections: SelectionState
): BallEntry => ({
  timestamp: new Date(),
  bowlerType: selections.bowler as BowlerType,
  deliveryPosition: selections.delivery as DeliveryPosition,
  takeResult: selections.take as TakeResult,
  outcomeDetails:
    (selections.collection as CollectionDifficulty) ||
    (selections.error as ErrorReason),
  throwInResult: selections.throwIn as ThrowInResult,
});
