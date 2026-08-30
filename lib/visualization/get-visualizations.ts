import apiFlow from "@/data/visualizations/api-flow.json";
import arpFlow from "@/data/visualizations/arp-flow.json";
import arrayFlow from "@/data/visualizations/array-flow.json";
import bootProcessFlow from "@/data/visualizations/boot-process-flow.json";
import cdnFlow from "@/data/visualizations/cdn-flow.json";
import cliNavigationFlow from "@/data/visualizations/cli-navigation-flow.json";
import clientServerFlow from "@/data/visualizations/client-server-flow.json";
import cloudVmFlow from "@/data/visualizations/cloud-vm-flow.json";
import coapFlow from "@/data/visualizations/coap-flow.json";
import corsFlow from "@/data/visualizations/cors-flow.json";
import cpuMemoryFlow from "@/data/visualizations/cpu-memory-flow.json";
import curlRequestFlow from "@/data/visualizations/curl-request-flow.json";
import databaseFlow from "@/data/visualizations/database-flow.json";
import deployFlow from "@/data/visualizations/deploy-flow.json";
import dhcpFlow from "@/data/visualizations/dhcp-flow.json";
import dnsFlow from "@/data/visualizations/dns-flow.json";
import dockerFlow from "@/data/visualizations/docker-flow.json";
import edgeComputingFlow from "@/data/visualizations/edge-computing-flow.json";
import embeddedBoardFlow from "@/data/visualizations/embedded-board-flow.json";
import fileOpsFlow from "@/data/visualizations/file-ops-flow.json";
import fileReadFlow from "@/data/visualizations/file-read-flow.json";
import fileSearchFlow from "@/data/visualizations/file-search-flow.json";
import firewallFlow from "@/data/visualizations/firewall-flow.json";
import frontendBackendFlow from "@/data/visualizations/frontend-backend-flow.json";
import gitBranchFlow from "@/data/visualizations/git-branch-flow.json";
import gitCommitFlow from "@/data/visualizations/git-commit-flow.json";
import gitDiffFlow from "@/data/visualizations/git-diff-flow.json";
import gitLogFlow from "@/data/visualizations/git-log-flow.json";
import gitMergeFlow from "@/data/visualizations/git-merge-flow.json";
import gitPushFlow from "@/data/visualizations/git-push-flow.json";
import gitStashFlow from "@/data/visualizations/git-stash-flow.json";
import gitWorkflowFlow from "@/data/visualizations/git-workflow-flow.json";
import graphqlFlow from "@/data/visualizations/graphql-flow.json";
import grepFlow from "@/data/visualizations/grep-flow.json";
import hashTableFlow from "@/data/visualizations/hash-table-flow.json";
import httpFlow from "@/data/visualizations/http-flow.json";
import httpsFlow from "@/data/visualizations/https-flow.json";
import imapFlow from "@/data/visualizations/imap-flow.json";
import iotGatewayFlow from "@/data/visualizations/iot-gateway-flow.json";
import ipConfigFlow from "@/data/visualizations/ip-config-flow.json";
import ipFlow from "@/data/visualizations/ip-flow.json";
import jsonFlow from "@/data/visualizations/json-flow.json";
import jwtFlow from "@/data/visualizations/jwt-flow.json";
import kubernetesFlow from "@/data/visualizations/kubernetes-flow.json";
import linkedListFlow from "@/data/visualizations/linked-list-flow.json";
import llmFlow from "@/data/visualizations/llm-flow.json";
import loadBalancerFlow from "@/data/visualizations/load-balancer-flow.json";
import loginFlow from "@/data/visualizations/login-flow.json";
import monitoringFlow from "@/data/visualizations/monitoring-flow.json";
import motherboardFlow from "@/data/visualizations/motherboard-flow.json";
import mqttFlow from "@/data/visualizations/mqtt-flow.json";
import natFlow from "@/data/visualizations/nat-flow.json";
import netstatFlow from "@/data/visualizations/netstat-flow.json";
import networkConnectFlow from "@/data/visualizations/network-connect-flow.json";
import networkHardwareFlow from "@/data/visualizations/network-hardware-flow.json";
import npmFlow from "@/data/visualizations/npm-flow.json";
import oauthFlow from "@/data/visualizations/oauth-flow.json";
import objectStorageFlow from "@/data/visualizations/object-storage-flow.json";
import oopFlow from "@/data/visualizations/oop-flow.json";
import openWebsiteFlow from "@/data/visualizations/open-website-flow.json";
import peripheralFlow from "@/data/visualizations/peripheral-flow.json";
import pingTestFlow from "@/data/visualizations/ping-test-flow.json";
import proxyFlow from "@/data/visualizations/proxy-flow.json";
import ragFlow from "@/data/visualizations/rag-flow.json";
import redisFlow from "@/data/visualizations/redis-flow.json";
import restFlow from "@/data/visualizations/rest-flow.json";
import securityHardwareFlow from "@/data/visualizations/security-hardware-flow.json";
import sensorFlow from "@/data/visualizations/sensor-flow.json";
import serverInfraFlow from "@/data/visualizations/server-infra-flow.json";
import serverlessFlow from "@/data/visualizations/serverless-flow.json";
import smtpFlow from "@/data/visualizations/smtp-flow.json";
import specializedChipFlow from "@/data/visualizations/specialized-chip-flow.json";
import sqlQueryFlow from "@/data/visualizations/sql-query-flow.json";
import sseFlow from "@/data/visualizations/sse-flow.json";
import sshFlow from "@/data/visualizations/ssh-flow.json";
import stackFlow from "@/data/visualizations/stack-flow.json";
import subnetFlow from "@/data/visualizations/subnet-flow.json";
import tcpFlow from "@/data/visualizations/tcp-flow.json";
import tracerouteFlow from "@/data/visualizations/traceroute-flow.json";
import treeFlow from "@/data/visualizations/tree-flow.json";
import udpFlow from "@/data/visualizations/udp-flow.json";
import vpnFlow from "@/data/visualizations/vpn-flow.json";
import websocketFlow from "@/data/visualizations/websocket-flow.json";
import whoisFlow from "@/data/visualizations/whois-flow.json";
import type { Visualization } from "@/types/visualization";

const visualizations: Visualization[] = [
  apiFlow,
  arpFlow,
  arrayFlow,
  bootProcessFlow,
  cdnFlow,
  cliNavigationFlow,
  clientServerFlow,
  cloudVmFlow,
  coapFlow,
  corsFlow,
  cpuMemoryFlow,
  curlRequestFlow,
  databaseFlow,
  deployFlow,
  dhcpFlow,
  dnsFlow,
  dockerFlow,
  edgeComputingFlow,
  embeddedBoardFlow,
  fileOpsFlow,
  fileReadFlow,
  fileSearchFlow,
  firewallFlow,
  frontendBackendFlow,
  gitBranchFlow,
  gitCommitFlow,
  gitDiffFlow,
  gitLogFlow,
  gitMergeFlow,
  gitPushFlow,
  gitStashFlow,
  gitWorkflowFlow,
  graphqlFlow,
  grepFlow,
  hashTableFlow,
  httpFlow,
  httpsFlow,
  imapFlow,
  iotGatewayFlow,
  ipConfigFlow,
  ipFlow,
  jsonFlow,
  jwtFlow,
  kubernetesFlow,
  linkedListFlow,
  llmFlow,
  loadBalancerFlow,
  loginFlow,
  monitoringFlow,
  motherboardFlow,
  mqttFlow,
  natFlow,
  netstatFlow,
  networkConnectFlow,
  networkHardwareFlow,
  npmFlow,
  oauthFlow,
  objectStorageFlow,
  oopFlow,
  openWebsiteFlow,
  peripheralFlow,
  pingTestFlow,
  proxyFlow,
  ragFlow,
  redisFlow,
  restFlow,
  securityHardwareFlow,
  sensorFlow,
  serverInfraFlow,
  serverlessFlow,
  smtpFlow,
  specializedChipFlow,
  sqlQueryFlow,
  sseFlow,
  sshFlow,
  stackFlow,
  subnetFlow,
  tcpFlow,
  tracerouteFlow,
  treeFlow,
  udpFlow,
  vpnFlow,
  websocketFlow,
  whoisFlow,
] as Visualization[];

export function getAllVisualizations(): Visualization[] {
  return visualizations;
}

export function getVisualizationBySlug(slug: string): Visualization | undefined {
  return visualizations.find((viz) => viz.slug === slug);
}

export function getVisualizationSlugs(): string[] {
  return visualizations.map((viz) => viz.slug);
}

export function getNetworkVisualizations(): Visualization[] {
  return visualizations.filter((viz) => viz.category === "network");
}

export function getProgrammingVisualizations(): Visualization[] {
  return visualizations.filter((viz) => viz.category === "programming");
}

export function getVisualizationsByCategory(category: string): Visualization[] {
  return visualizations.filter((viz) => viz.category === category);
}

export function groupVisualizationsByCategory(): Array<{
  category: string;
  visualizations: Visualization[];
}> {
  const order = ["network", "programming", "security", "database", "devops", "iot", "cloud"];
  const grouped = new Map<string, Visualization[]>();

  for (const viz of visualizations) {
    const key = viz.category ?? "other";
    const list = grouped.get(key) ?? [];
    list.push(viz);
    grouped.set(key, list);
  }

  const known = order
    .filter((category) => grouped.has(category))
    .map((category) => ({
      category,
      visualizations: grouped.get(category)!,
    }));

  const extras = [...grouped.entries()]
    .filter(([category]) => !order.includes(category))
    .map(([category, items]) => ({ category, visualizations: items }));

  return [...known, ...extras];
}

export function getVisualizationByConcept(conceptSlug: string): Visualization | undefined {
  return visualizations.find((viz) => viz.conceptSlug === conceptSlug);
}
