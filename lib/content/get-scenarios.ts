import cliNetworkDebug from "@/data/scenarios/cli-network-debug.json";
import computerBoot from "@/data/scenarios/computer-boot.json";
import databaseCrud from "@/data/scenarios/database-crud.json";
import dataStructureBasics from "@/data/scenarios/data-structure-basics.json";
import deployApp from "@/data/scenarios/deploy-app.json";
import dnsLookup from "@/data/scenarios/dns-lookup.json";
import gitFeatureBranch from "@/data/scenarios/git-feature-branch.json";
import gitWorkflow from "@/data/scenarios/git-workflow.json";
import hardwareBuildPc from "@/data/scenarios/hardware-build-pc.json";
import iotData from "@/data/scenarios/iot-data.json";
import login from "@/data/scenarios/login.json";
import npmProjectSetup from "@/data/scenarios/npm-project-setup.json";
import oauthSocialLogin from "@/data/scenarios/oauth-social-login.json";
import onlinePayment from "@/data/scenarios/online-payment.json";
import openWebsite from "@/data/scenarios/open-website.json";
import ragChat from "@/data/scenarios/rag-chat.json";
import sendEmail from "@/data/scenarios/send-email.json";
import type { Scenario } from "@/types/scenario";

const scenarios: Scenario[] = [
  cliNetworkDebug,
  computerBoot,
  databaseCrud,
  dataStructureBasics,
  deployApp,
  dnsLookup,
  gitFeatureBranch,
  gitWorkflow,
  hardwareBuildPc,
  iotData,
  login,
  npmProjectSetup,
  oauthSocialLogin,
  onlinePayment,
  openWebsite,
  ragChat,
  sendEmail,
] as Scenario[];

export function getAllScenarios(): Scenario[] {
  return scenarios;
}

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}

export function getScenarioSlugs(): string[] {
  return scenarios.map((scenario) => scenario.slug);
}
