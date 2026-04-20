import type { Segment } from "@/types/quiz";
import type { ResultCopy } from "./types";
import ops from "./ops";
import team from "./team";
import sales from "./sales";
import service from "./service";

export const COPY_BY_SEGMENT: Record<Segment, ResultCopy> = {
  ops,
  team,
  sales,
  service,
};
