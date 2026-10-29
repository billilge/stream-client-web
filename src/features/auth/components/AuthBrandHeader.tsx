import streamLogo from "@/assets/icons/auth/stream-logo.svg";
import streamWordmark from "@/assets/icons/auth/stream-wordmark.svg";

// Figma: Login Brand Header (nodeId 3685:113326) — 심볼(48) + stream 워드마크, 간격 6.
function AuthBrandHeader() {
  return (
    <div className="flex items-center gap-1.5">
      <img alt="" className="size-12" src={streamLogo} />
      <img alt="stream" src={streamWordmark} />
    </div>
  );
}

export default AuthBrandHeader;
