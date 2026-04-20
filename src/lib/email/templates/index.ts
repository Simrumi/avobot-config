import type { Lead } from "@/lib/supabase";
import type { TemplateKey } from "@/types/quiz";
import type { ReactElement } from "react";

import OpsD0, { subject as opsD0Subject } from "./ops_d0_result";
import OpsD1, { subject as opsD1Subject } from "./ops_d1_mechanism";
import OpsD3, { subject as opsD3Subject } from "./ops_d3_proof";
import OpsD5, { subject as opsD5Subject } from "./ops_d5_objections";
import OpsD9, { subject as opsD9Subject } from "./ops_d9_last_call";

import TeamD0, { subject as teamD0Subject } from "./team_d0_result";
import TeamD1, { subject as teamD1Subject } from "./team_d1_mechanism";
import TeamD3, { subject as teamD3Subject } from "./team_d3_proof";
import TeamD5, { subject as teamD5Subject } from "./team_d5_objections";
import TeamD9, { subject as teamD9Subject } from "./team_d9_last_call";

import SalesD0, { subject as salesD0Subject } from "./sales_d0_result";
import SalesD1, { subject as salesD1Subject } from "./sales_d1_mechanism";
import SalesD3, { subject as salesD3Subject } from "./sales_d3_proof";
import SalesD5, { subject as salesD5Subject } from "./sales_d5_objections";
import SalesD9, { subject as salesD9Subject } from "./sales_d9_last_call";

import ServiceD0, { subject as serviceD0Subject } from "./service_d0_result";
import ServiceD1, { subject as serviceD1Subject } from "./service_d1_mechanism";
import ServiceD3, { subject as serviceD3Subject } from "./service_d3_proof";
import ServiceD5, { subject as serviceD5Subject } from "./service_d5_objections";
import ServiceD9, { subject as serviceD9Subject } from "./service_d9_last_call";

type Entry = {
  component: (props: { lead: Lead }) => ReactElement;
  subject: (lead: Lead) => string;
};

export const TEMPLATES: Record<TemplateKey, Entry> = {
  ops_d0_result: { component: OpsD0, subject: opsD0Subject },
  ops_d1_mechanism: { component: OpsD1, subject: opsD1Subject },
  ops_d3_proof: { component: OpsD3, subject: opsD3Subject },
  ops_d5_objections: { component: OpsD5, subject: opsD5Subject },
  ops_d9_last_call: { component: OpsD9, subject: opsD9Subject },

  team_d0_result: { component: TeamD0, subject: teamD0Subject },
  team_d1_mechanism: { component: TeamD1, subject: teamD1Subject },
  team_d3_proof: { component: TeamD3, subject: teamD3Subject },
  team_d5_objections: { component: TeamD5, subject: teamD5Subject },
  team_d9_last_call: { component: TeamD9, subject: teamD9Subject },

  sales_d0_result: { component: SalesD0, subject: salesD0Subject },
  sales_d1_mechanism: { component: SalesD1, subject: salesD1Subject },
  sales_d3_proof: { component: SalesD3, subject: salesD3Subject },
  sales_d5_objections: { component: SalesD5, subject: salesD5Subject },
  sales_d9_last_call: { component: SalesD9, subject: salesD9Subject },

  service_d0_result: { component: ServiceD0, subject: serviceD0Subject },
  service_d1_mechanism: { component: ServiceD1, subject: serviceD1Subject },
  service_d3_proof: { component: ServiceD3, subject: serviceD3Subject },
  service_d5_objections: { component: ServiceD5, subject: serviceD5Subject },
  service_d9_last_call: { component: ServiceD9, subject: serviceD9Subject },
};

export function getTemplate(key: string): Entry | null {
  return (TEMPLATES as Record<string, Entry>)[key] ?? null;
}
