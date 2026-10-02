"use client";

import { CidrMaskTab } from "@/components/netcalc/cidr-mask-tab";
import { Ipv4SubnetTab } from "@/components/netcalc/ipv4-subnet-tab";
import { Ipv6Tab } from "@/components/netcalc/ipv6-tab";
import { SameSubnetTab } from "@/components/netcalc/same-subnet-tab";
import { VlsmTab } from "@/components/netcalc/vlsm-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { value: "subnet", label: "IPv4 Subnet" },
  { value: "convert", label: "CIDR ↔ Mask" },
  { value: "same", label: "Subnet เดียวกัน?" },
  { value: "vlsm", label: "VLSM" },
  { value: "ipv6", label: "IPv6" },
] as const;

export function NetworkCalculator() {
  return (
    <Tabs defaultValue="subnet" className="w-full">
      <TabsList
        variant="line"
        className="h-auto w-full flex-wrap justify-start gap-1 overflow-x-auto"
      >
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="px-3 py-1.5">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="subnet" className="mt-4">
        <Ipv4SubnetTab />
      </TabsContent>
      <TabsContent value="convert" className="mt-4">
        <CidrMaskTab />
      </TabsContent>
      <TabsContent value="same" className="mt-4">
        <SameSubnetTab />
      </TabsContent>
      <TabsContent value="vlsm" className="mt-4">
        <VlsmTab />
      </TabsContent>
      <TabsContent value="ipv6" className="mt-4">
        <Ipv6Tab />
      </TabsContent>
    </Tabs>
  );
}
