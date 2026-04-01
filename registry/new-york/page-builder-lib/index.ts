export type {
  RowSplit,
  SectionConfig,
  PageLayout,
  SizeHint,
  VariantMeta,
  SectionDefinition,
  SectionRegistry,
  EditorActions,
} from "./types";

export {
  SPLIT_GRID_TEMPLATES,
  SPLIT_LABELS,
  ALL_SPLITS,
  CURRENT_SCHEMA_VERSION,
  resolveColumn,
  canFitInColumn,
  allowedColumnsFor,
  dedup,
  buildRows,
  moveSection,
  changeColumn,
  changeSplit,
  changeVariant,
  changeVisibility,
  swapSections,
  placeSection,
  computeSlots,
  countRows,
  moveSectionToIndex,
  buildAutoFixtures,
  sectionsForColumn,
  randomizeLayout,
  migrateLayout,
} from "./layout-operations";

export type {
  Column,
  RenderRow,
  SwapResult,
  LayoutSlot,
} from "./layout-operations";
