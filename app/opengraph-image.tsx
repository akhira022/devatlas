import { ImageResponse } from "next/og";

export const alt = "DEV ATLAS — Interactive Knowledge Map for Developers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0B1220",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "#3B82F6",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          DA
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>DEV ATLAS</div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#94A3B8", maxWidth: 900 }}>
          แผนที่ความรู้เชิงโต้ตอบสำหรับนักพัฒนา
        </div>
      </div>
    ),
    { ...size },
  );
}
