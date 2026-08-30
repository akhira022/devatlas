import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURED = [
  {
    slug: "http-flow",
    title: "HTTP Request Flow",
    description: "Browser ส่ง request ไปยัง server แล้วได้ response กลับมา",
    protocol: "HTTP",
  },
  {
    slug: "dhcp-flow",
    title: "DHCP Lease",
    description: "เครื่องใหม่ได้ IP address ผ่าน Discover → Offer → Request → ACK",
    protocol: "DHCP",
  },
  {
    slug: "dns-flow",
    title: "DNS Lookup",
    description: "แปลงชื่อโดเมนเป็น IP address ทีละขั้น",
    protocol: "DNS",
  },
] as const;

export function FeaturedVisualization() {
  return (
    <section className="container px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold">Animation แนะนำ</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {FEATURED.map((item) => (
          <Link key={item.slug} href={`/visualize/${item.slug}`}>
            <Card className="group h-full interactive-card">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.protocol}
                  </span>
                  <Play className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <CardTitle as="h3" className="flex items-center justify-between text-base">
                  {item.title}
                  <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
