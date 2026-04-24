import { hasSanity } from "../../../sanity/env";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!hasSanity) {
    return (
      <div
        style={{
          padding: "3rem",
          fontFamily: "Times New Roman, Times, serif",
          maxWidth: 560,
          margin: "4rem auto",
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>
          Sanity Studio — not configured
        </h1>
        <p>
          Create a Sanity project at{" "}
          <a href="https://www.sanity.io/manage">sanity.io/manage</a>, then copy
          <code> .env.local.example </code>
          to <code>.env.local</code> and set{" "}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
        </p>
      </div>
    );
  }
  return <StudioClient />;
}
