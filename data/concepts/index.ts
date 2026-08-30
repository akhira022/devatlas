import api from "./api.json";
import arduino from "./arduino.json";
import arp from "./arp.json";
import array from "./array.json";
import asic from "./asic.json";
import authentication from "./authentication.json";
import authorization from "./authorization.json";
import backend from "./backend.json";
import biosUefi from "./bios-uefi.json";
import bootProcess from "./boot-process.json";
import cat from "./cat.json";
import cd from "./cd.json";
import cdn from "./cdn.json";
import chmod from "./chmod.json";
import ciCd from "./ci-cd.json";
import client from "./client.json";
import cloudComputing from "./cloud-computing.json";
import coap from "./coap.json";
import cors from "./cors.json";
import cpu from "./cpu.json";
import curl from "./curl.json";
import dataCenter from "./data-center.json";
import dataStructure from "./data-structure.json";
import database from "./database.json";
import deployment from "./deployment.json";
import dhcp from "./dhcp.json";
import dig from "./dig.json";
import displayMonitor from "./display-monitor.json";
import dns from "./dns.json";
import docker from "./docker.json";
import edgeComputing from "./edge-computing.json";
import edgeDeviceHardware from "./edge-device-hardware.json";
import embedding from "./embedding.json";
import encryption from "./encryption.json";
import esp32 from "./esp32.json";
import fineTuning from "./fine-tuning.json";
import firewall from "./firewall.json";
import fpga from "./fpga.json";
import frontend from "./frontend.json";
import ghCli from "./gh-cli.json";
import gitAdd from "./git-add.json";
import gitBranch from "./git-branch.json";
import gitCheckout from "./git-checkout.json";
import gitClone from "./git-clone.json";
import gitCommit from "./git-commit.json";
import gitDiff from "./git-diff.json";
import gitFetch from "./git-fetch.json";
import gitInit from "./git-init.json";
import gitLog from "./git-log.json";
import gitMerge from "./git-merge.json";
import gitPull from "./git-pull.json";
import gitPush from "./git-push.json";
import gitRebase from "./git-rebase.json";
import gitRemote from "./git-remote.json";
import gitStash from "./git-stash.json";
import gitStatus from "./git-status.json";
import git from "./git.json";
import githubPr from "./github-pr.json";
import gpu from "./gpu.json";
import graphStructure from "./graph-structure.json";
import graphql from "./graphql.json";
import grep from "./grep.json";
import hashTable from "./hash-table.json";
import hashing from "./hashing.json";
import heap from "./heap.json";
import host from "./host.json";
import http from "./http.json";
import https from "./https.json";
import hypervisorHost from "./hypervisor-host.json";
import ifconfig from "./ifconfig.json";
import iotGateway from "./iot-gateway.json";
import ip from "./ip.json";
import json from "./json.json";
import jwt from "./jwt.json";
import kubernetes from "./kubernetes.json";
import linkedList from "./linked-list.json";
import llm from "./llm.json";
import loadBalancer from "./load-balancer.json";
import logging from "./logging.json";
import lorawan from "./lorawan.json";
import ls from "./ls.json";
import machineLearning from "./machine-learning.json";
import mkdir from "./mkdir.json";
import monitoring from "./monitoring.json";
import motherboard from "./motherboard.json";
import mqtt from "./mqtt.json";
import nat from "./nat.json";
import nc from "./nc.json";
import netstat from "./netstat.json";
import neuralNetwork from "./neural-network.json";
import nic from "./nic.json";
import nosql from "./nosql.json";
import npm from "./npm.json";
import nslookup from "./nslookup.json";
import oauth from "./oauth.json";
import objectStorage from "./object-storage.json";
import oop from "./oop.json";
import orm from "./orm.json";
import peripheralIo from "./peripheral-io.json";
import ping from "./ping.json";
import promptEngineering from "./prompt-engineering.json";
import proxy from "./proxy.json";
import psInvokeWebrequest from "./ps-invoke-webrequest.json";
import psResolveDnsname from "./ps-resolve-dnsname.json";
import psTestNetconnection from "./ps-test-netconnection.json";
import psu from "./psu.json";
import pwd from "./pwd.json";
import queue from "./queue.json";
import rackServer from "./rack-server.json";
import rag from "./rag.json";
import raid from "./raid.json";
import ram from "./ram.json";
import raspberryPi from "./raspberry-pi.json";
import redis from "./redis.json";
import rest from "./rest.json";
import router from "./router.json";
import saas from "./saas.json";
import scp from "./scp.json";
import secureBoot from "./secure-boot.json";
import sensor from "./sensor.json";
import server from "./server.json";
import serverless from "./serverless.json";
import smtp from "./smtp.json";
import sql from "./sql.json";
import sse from "./sse.json";
import ssh from "./ssh.json";
import stack from "./stack.json";
import storage from "./storage.json";
import subnetting from "./subnetting.json";
import networkSwitch from "./switch.json";
import tcp from "./tcp.json";
import telnet from "./telnet.json";
import terraform from "./terraform.json";
import tls from "./tls.json";
import tpm from "./tpm.json";
import traceroute from "./traceroute.json";
import tree from "./tree.json";
import udp from "./udp.json";
import virtualMachine from "./virtual-machine.json";
import vpn from "./vpn.json";
import websocket from "./websocket.json";
import wget from "./wget.json";
import whois from "./whois.json";
import winCd from "./win-cd.json";
import winCopy from "./win-copy.json";
import winDel from "./win-del.json";
import winDir from "./win-dir.json";
import winFindstr from "./win-findstr.json";
import winIpconfig from "./win-ipconfig.json";
import winMkdir from "./win-mkdir.json";
import winNetstat from "./win-netstat.json";
import winNpm from "./win-npm.json";
import winNslookup from "./win-nslookup.json";
import winPing from "./win-ping.json";
import winTracert from "./win-tracert.json";
import winType from "./win-type.json";
import winWhere from "./win-where.json";
import type { Concept } from "@/types/concept";

export const concepts: Concept[] = [
  api,
  arduino,
  arp,
  array,
  asic,
  authentication,
  authorization,
  backend,
  biosUefi,
  bootProcess,
  cat,
  cd,
  cdn,
  chmod,
  ciCd,
  client,
  cloudComputing,
  coap,
  cors,
  cpu,
  curl,
  dataCenter,
  dataStructure,
  database,
  deployment,
  dhcp,
  dig,
  displayMonitor,
  dns,
  docker,
  edgeComputing,
  edgeDeviceHardware,
  embedding,
  encryption,
  esp32,
  fineTuning,
  firewall,
  fpga,
  frontend,
  ghCli,
  gitAdd,
  gitBranch,
  gitCheckout,
  gitClone,
  gitCommit,
  gitDiff,
  gitFetch,
  gitInit,
  gitLog,
  gitMerge,
  gitPull,
  gitPush,
  gitRebase,
  gitRemote,
  gitStash,
  gitStatus,
  git,
  githubPr,
  gpu,
  graphStructure,
  graphql,
  grep,
  hashTable,
  hashing,
  heap,
  host,
  http,
  https,
  hypervisorHost,
  ifconfig,
  iotGateway,
  ip,
  json,
  jwt,
  kubernetes,
  linkedList,
  llm,
  loadBalancer,
  logging,
  lorawan,
  ls,
  machineLearning,
  mkdir,
  monitoring,
  motherboard,
  mqtt,
  nat,
  nc,
  netstat,
  neuralNetwork,
  nic,
  nosql,
  npm,
  nslookup,
  oauth,
  objectStorage,
  oop,
  orm,
  peripheralIo,
  ping,
  promptEngineering,
  proxy,
  psInvokeWebrequest,
  psResolveDnsname,
  psTestNetconnection,
  psu,
  pwd,
  queue,
  rackServer,
  rag,
  raid,
  ram,
  raspberryPi,
  redis,
  rest,
  router,
  saas,
  scp,
  secureBoot,
  sensor,
  server,
  serverless,
  smtp,
  sql,
  sse,
  ssh,
  stack,
  storage,
  subnetting,
  networkSwitch,
  tcp,
  telnet,
  terraform,
  tls,
  tpm,
  traceroute,
  tree,
  udp,
  virtualMachine,
  vpn,
  websocket,
  wget,
  whois,
  winCd,
  winCopy,
  winDel,
  winDir,
  winFindstr,
  winIpconfig,
  winMkdir,
  winNetstat,
  winNpm,
  winNslookup,
  winPing,
  winTracert,
  winType,
  winWhere,
] as Concept[];
