export const Gender = {
  undefined: "Undef",
  male: "Male",
  female: "Female",
};

export const RelationShip = {
  none: "None",
  childOf: "Child of",
  groupOf: "In group",
};

export const RelationShipCombo = [
  { key: "0", value: RelationShip.internal },
  { key: "1", value: RelationShip.external },
  { key: "2", value: RelationShip.groupOf },
];
