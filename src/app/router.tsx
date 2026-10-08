import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import BililgeListScreen from "@/features/bililge/BililgeListScreen";
import ChatEntryScreen from "@/features/chat/ChatEntryScreen";
import EventsApplicationClosedScreen from "@/features/events/EventsApplicationClosedScreen";
import EventsApplicationCompleteScreen from "@/features/events/EventsApplicationCompleteScreen";
import EventsApplicationScreen from "@/features/events/EventsApplicationScreen";
import EventsDetailScreen from "@/features/events/EventsDetailScreen";
import EventsListScreen from "@/features/events/EventsListScreen";
import FeeTransferCompleteScreen from "@/features/fee/FeeTransferCompleteScreen";
import FeeTransferConfirmScreen from "@/features/fee/FeeTransferConfirmScreen";
import FeeTransferSemesterScreen from "@/features/fee/FeeTransferSemesterScreen";
import FeeTransferTossScreen from "@/features/fee/FeeTransferTossScreen";
import FeeTransferTranscriptScreen from "@/features/fee/FeeTransferTranscriptScreen";
import FeedbacksDetailScreen from "@/features/feedbacks/FeedbacksDetailScreen";
import FeedbacksListScreen from "@/features/feedbacks/FeedbacksListScreen";
import FeedbacksNewScreen from "@/features/feedbacks/FeedbacksNewScreen";
import HomeScreen from "@/features/home/HomeScreen";
import LockersApplyCompleteScreen from "@/features/lockers/LockersApplyCompleteScreen";
import LockersApplyFailureScreen from "@/features/lockers/LockersApplyFailureScreen";
import LockersApplyScreen from "@/features/lockers/LockersApplyScreen";
import LockersLockerSelectScreen from "@/features/lockers/LockersLockerSelectScreen";
import LockersSectionSelectScreen from "@/features/lockers/LockersSectionSelectScreen";
import NoticesDetailScreen from "@/features/notices/NoticesDetailScreen";
import NoticesListScreen from "@/features/notices/NoticesListScreen";
import SearchScreen from "@/features/search/SearchScreen";

// 앱의 모든 라우트는 이 객체 배열 한곳에서 정의한다 — 새 화면은 여기에 라우트를 추가한다.
// satisfies로 선언 시점에 RouteObject 형태를 검사한다.
// 화면별 레이아웃 옵션(하단 탭 숨김 등)은 레이아웃 라우트를 따로 두지 않고 각 라우트의 handle로 지정한다.
const routes = [
  {
    children: [
      {
        children: [
          {
            element: <HomeScreen />,
            path: "/",
          },
          {
            element: <BililgeListScreen />,
            path: "/bililge",
          },
          {
            element: <EventsListScreen />,
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/events",
          },
          {
            element: <NoticesListScreen />,
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/notices",
          },
          {
            element: <FeedbacksListScreen />,
            // 공지 화면과 같은 이유(카드 없이 구분선으로만 나뉘는 목록)로 흰 면을 쓴다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/feedbacks",
          },
          {
            element: <FeedbacksNewScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면. Figma 루트 배경도 흰 면이다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/feedbacks/new",
          },
          {
            element: <FeedbacksDetailScreen />,
            // 상세(모아보기) 화면 — 목록 화면과 같은 흰 배경, Bottom Nav 없이 뒤로가기(닫기)로만 나간다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/feedbacks/:feedbackId",
          },
          {
            element: <EventsDetailScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId",
          },
          {
            element: <EventsApplicationScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply",
          },
          {
            element: <EventsApplicationCompleteScreen />,
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/complete",
          },
          {
            element: <EventsApplicationClosedScreen />,
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/closed",
          },
          {
            element: <NoticesDetailScreen />,
            // 상세 화면은 뒤로가기로만 돌아가는 흐름이라 Bottom Nav를 안 보여준다. 카드 없이
            // 본문이 배경까지 흰 면이라 목록 화면과 같은 background: "normal"을 쓴다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/notices/:noticeId",
          },
          {
            element: <LockersApplyScreen />,
            // 시트만 있는 화면이라 뒤에 Bottom Nav가 비쳐도 Figma(홈 위에 뜨는 시트)와 같다
            path: "/lockers/apply",
          },
          // 학생회비 계좌 송금 플로우 — 전부 하단 고정 버튼(Action Area)이 있는 흰 배경 화면이다.
          // 단계를 오갈 수 있어야 해서 한 라우트 위저드가 아니라 단계별 경로로 나눠 뒀다.
          {
            element: <FeeTransferSemesterScreen />,
            // Figma 3562:162833
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/fee/transfer/semester",
          },
          {
            element: <FeeTransferTranscriptScreen />,
            // Figma 3562:162845(업로드 전) · 3562:162891(업로드 후) — 한 화면의 상태 차이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/fee/transfer/transcript",
          },
          {
            element: <FeeTransferTossScreen />,
            // Figma 3562:163025(안내) · 3562:163046(이동 실패) — 한 화면의 상태 차이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/fee/transfer/toss",
          },
          {
            element: <FeeTransferConfirmScreen />,
            // Figma 3562:162973
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/fee/transfer/confirm",
          },
          {
            element: <FeeTransferCompleteScreen />,
            // 신청 결과 화면과 같은 모양이다(Figma 3562:163013)
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/fee/transfer/complete",
          },
          {
            element: <SearchScreen />,
            // 검색 화면은 Figma에 Bottom Nav가 없고(뒤로가기로 진입한 화면에 복귀) 배경이 흰 면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/search",
          },
          {
            element: <ChatEntryScreen />,
            // Figma 챗봇 진입 화면에는 Bottom Nav가 없다(뒤로가기로 홈에 복귀). 흰 배경 위에
            // 그라데이션이 얹히는 구조라 다른 흰 배경 화면들과 같은 normal을 쓴다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/chat",
          },
          {
            element: <LockersSectionSelectScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면.
            // 구역 카드 배경이 Background/Normal/Alternative(#f7f7f8)라 화면까지 같은 색이면
            // 카드가 배경에 묻힌다 — Figma대로 흰 면을 깐다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/lockers/apply/sections",
          },
          {
            element: <LockersLockerSelectScreen />,
            // 구역 선택 화면과 같다 — 하단 고정 선택 영역이 있고, 칸 배경이 흰 면 위에 놓인다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/lockers/apply/sections/:sectionId",
          },
          {
            element: <LockersApplyCompleteScreen />,
            // 신청 결과 화면 — 행사 신청 결과와 같이 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/lockers/apply/sections/:sectionId/complete",
          },
          {
            element: <LockersApplyFailureScreen />,
            // 신청 결과 화면 — 완료 화면과 같다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/lockers/apply/sections/:sectionId/failure/:reason",
          },
          // 라우트가 없는 경로 — 레이아웃 안에 둬서 하단 탭이 유지되고, 탭 경로(/event 등)면 그 탭이 활성으로 보인다
          {
            element: <ComingSoonScreen />,
            path: "*",
          },
        ],
        element: <ScreenLayoutRoute />,
      },
    ],
    element: <App />,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
