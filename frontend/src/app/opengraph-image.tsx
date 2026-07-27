import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B120D",
          color: "#F6F1EA",
        }}
      >
        <div style={{ fontSize: 96, letterSpacing: 8, display: "flex" }}>NEVORA</div>
        <div style={{ fontSize: 28, color: "#C8A45D", marginTop: 24, display: "flex" }}>
          Premium Coffee
        </div>
      </div>
    ),
    { ...size },
  );
}
