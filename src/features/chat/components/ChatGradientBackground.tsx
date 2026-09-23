import { createPortal } from "react-dom";
import gradientBlob from "@/assets/icons/chat/gradient-blob.svg";
import { useScreenBackgroundPortal } from "@/components/ui/useScreenBackgroundPortal";

// Figma: 챗봇 진입 화면 배경의 Background Blur — 실제 원 2개(파랑 #589BFE·보라 #896CFF,
// blur(100px), opacity 0.5)를 합친 SVG다. "화면 1"(nodeId 1887:91534)과 "화면 2"
// (1887:91558)가 이 이미지의 위치·크기만 다른 상태로 존재하는데, Figma에 실제 Smart Animate는
// 연결돼 있지 않다(get_motion_context 결과 없음) — 두 상태를 애니메이션의 시작/끝 프레임으로
// 보고 CSS @keyframes(chat-gradient-drift, index.css)로 그 사이를 오가게 만들었다.
// Figma 원본은 이 이미지를 늘리지 않고 원본 크기(736×675) 그대로 두고, 애니메이션하는 박스
// (chat-gradient-blob) 중앙에 맞춰서만 보여준다 — inset 음수 크롭이 그 방식이다. 박스 크기가
// 바뀌어도 이미지 자체는 그대로고 "어디까지 보이는지"만 바뀌는 셈이라, 여기서도 이미지를
// 늘리는 대신 flex 중앙 정렬로 같은 결과를 낸다(늘리면 블러 가장자리가 뭉개진다).
//
// left/top 좌표는 Figma에서 화면 루트(375×812) 기준이라 — 헤더(56px)까지 포함해 화면 전체
// 뒤에 깔려야 한다. ChatEntryScreen의 본문 영역(헤더 아래)에만 두면 좌표가 56px 밀리고,
// 헤더 위로는 아예 안 비쳐서 그라데이션이 실제보다 아래로 처지고 옅어 보인다 — 그래서 화면
// 콘텐츠의 일부로 두지 않고 ScreenLayout의 배경 포털(프레임 전체, 헤더보다 먼저 그려짐)에
// 그린다.
//
// Figma 화면 루트(1887:91534)의 배경은 흰색(Background/Normal/Normal)이고 그 위에 이 블러가
// 얹힌다 — router.tsx에서 /chat 라우트에 handle: { background: "normal" }을 지정해서
// ScreenLayout 루트 자체가 흰 배경을 깔아주므로, 여기서는 블러만 그린다.
//
// 대화가 시작되면(메시지를 하나라도 보내면) Figma의 "챗봇 대화창"(1770:63314) 화면은 이
// 블러 없이 흰 배경만 쓴다 — showBlob=false로 블러만 페이드아웃한다.
interface ChatGradientBackgroundProps {
  showBlob?: boolean;
}

function ChatGradientBackground({
  showBlob = true,
}: ChatGradientBackgroundProps) {
  const portalEl = useScreenBackgroundPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className={`chat-gradient-blob absolute flex rotate-[36.29deg] items-center justify-center transition-opacity duration-300 ${
          showBlob ? "opacity-100" : "opacity-0"
        }`}
      >
        <img alt="" className="block max-w-none" src={gradientBlob} />
      </div>
    </div>,
    portalEl,
  );
}

export default ChatGradientBackground;
