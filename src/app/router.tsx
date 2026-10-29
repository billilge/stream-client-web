import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import ArchivesDetailScreen from "@/features/archives/ArchivesDetailScreen";
import ArchivesListScreen from "@/features/archives/ArchivesListScreen";
import ArchivesPhotosScreen from "@/features/archives/ArchivesPhotosScreen";
import ArchivesPhotoViewerScreen from "@/features/archives/ArchivesPhotoViewerScreen";
import AuthEntryGate from "@/features/auth/AuthEntryGate";
import AuthSignupScreen from "@/features/auth/AuthSignupScreen";
import KConnectCallbackScreen from "@/features/auth/KConnectCallbackScreen";
import BililgeListScreen from "@/features/bililge/BililgeListScreen";
import ChatEntryScreen from "@/features/chat/ChatEntryScreen";
import EventsApplicationClosedScreen from "@/features/events/EventsApplicationClosedScreen";
import EventsApplicationCompleteScreen from "@/features/events/EventsApplicationCompleteScreen";
import EventsApplicationDetailScreen from "@/features/events/EventsApplicationDetailScreen";
import EventsApplicationScreen from "@/features/events/EventsApplicationScreen";
import EventsDetailScreen from "@/features/events/EventsDetailScreen";
import EventsListScreen from "@/features/events/EventsListScreen";
import FeePaymentsScreen from "@/features/fee/FeePaymentsScreen";
import FeedbacksDetailScreen from "@/features/feedbacks/FeedbacksDetailScreen";
import FeedbacksListScreen from "@/features/feedbacks/FeedbacksListScreen";
import FeedbacksMineDetailScreen from "@/features/feedbacks/FeedbacksMineDetailScreen";
import FeedbacksMineScreen from "@/features/feedbacks/FeedbacksMineScreen";
import FeedbacksNewScreen from "@/features/feedbacks/FeedbacksNewScreen";
import HomeScreen from "@/features/home/HomeScreen";
import LockersApplyCompleteScreen from "@/features/lockers/LockersApplyCompleteScreen";
import LockersApplyFailureScreen from "@/features/lockers/LockersApplyFailureScreen";
import LockersApplyScreen from "@/features/lockers/LockersApplyScreen";
import LockersAssignmentScreen from "@/features/lockers/LockersAssignmentScreen";
import LockersCellSelectScreen from "@/features/lockers/LockersCellSelectScreen";
import LockersMineScreen from "@/features/lockers/LockersMineScreen";
import LockersSectionSelectScreen from "@/features/lockers/LockersSectionSelectScreen";
import NoticesDetailScreen from "@/features/notices/NoticesDetailScreen";
import NoticesListScreen from "@/features/notices/NoticesListScreen";
import NotificationsScreen from "@/features/notifications/NotificationsScreen";
import NotificationsSettingsScreen from "@/features/notifications/NotificationsSettingsScreen";
import SearchScreen from "@/features/search/SearchScreen";
import PhoneChangeScreen from "@/features/settings/PhoneChangeScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";
import WithdrawalCompleteScreen from "@/features/settings/WithdrawalCompleteScreen";
import WithdrawalScreen from "@/features/settings/WithdrawalScreen";

// 앱의 모든 라우트는 이 객체 배열 한곳에서 정의한다 — 새 화면은 여기에 라우트를 추가한다.
// satisfies로 선언 시점에 RouteObject 형태를 검사한다.
// 화면별 레이아웃 옵션(하단 탭 숨김 등)은 레이아웃 라우트를 따로 두지 않고 각 라우트의 handle로 지정한다.
const routes = [
  {
    children: [
      {
        children: [
          {
            // 앱 첫 진입점 — 로그인한 기록이 없으면 로그인 화면으로 보낸다
            element: (
              <AuthEntryGate>
                <HomeScreen />
              </AuthEntryGate>
            ),
            path: "/",
          },
          {
            element: <BililgeListScreen tab="rent" />,
            path: "/bililge",
          },
          {
            element: <BililgeListScreen tab="return" />,
            // 빌릴게의 반납 탭 — 같은 화면을 탭만 바꿔 그리고, 하단 탭은 "빌릴게"가 선택된다
            handle: { bottomNavValue: "bililge" } satisfies ScreenRouteHandle,
            path: "/bililge/returns",
          },
          {
            element: <EventsListScreen tab="event" />,
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/events",
          },
          {
            element: <EventsListScreen tab="application" />,
            // 행사 목록의 신청내역 탭 — 같은 화면을 탭만 바꿔 그리고, 하단 탭은 "행사"가 선택된다
            handle: {
              background: "normal",
              bottomNavValue: "event",
            } satisfies ScreenRouteHandle,
            path: "/events/applications",
          },
          {
            element: <EventsApplicationDetailScreen />,
            // 하단 탭 없이 회색 배경(기본값) — 흰 카드가 뜬다
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/applications/:applicationId",
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
            element: <FeedbacksMineScreen />,
            // 내 내역 화면 — 하단 탭 없이 회색 배경(기본값)
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/my/feedbacks",
          },
          {
            element: <FeedbacksMineDetailScreen />,
            // 작성내역 상세 — 열린피드백 상세와 같은 흰 배경, 하단 탭 없음
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/my/feedbacks/:feedbackId",
          },
          {
            element: <FeePaymentsScreen />,
            // 내 내역 화면 — 하단 탭 없이 회색 배경(기본값)
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/my/fee",
          },
          {
            element: <LockersAssignmentScreen />,
            // 내 내역 화면 — 하단 탭 없이 회색 배경(기본값)
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/my/locker",
          },
          {
            element: <LockersMineScreen />,
            // 칸 선택 화면과 같은 흰 배경
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/my/locker/location",
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
            element: <SettingsScreen />,
            // 흰 카드가 회색 배경 위에 쌓이는 화면이라 background는 기본값(alternative)을 쓴다.
            // 설정은 뒤로가기로만 빠져나가는 흐름이라 Bottom Nav를 안 보여준다(Figma 3524:152322).
            // 설정의 "알림 설정" 행은 알림 화면이 이미 가진 /notifications/settings로 보낸다 —
            // Figma는 설정·알림 두 섹션에 같은 화면을 복제해 뒀지만 코드에서는 한 벌만 둔다.
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/settings",
          },
          {
            element: <PhoneChangeScreen />,
            // 입력칸 하나 + 하단 고정 버튼(Action Area)이 있는 흰 배경 화면(Figma 3524:152450)
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/settings/phone",
          },
          {
            element: <WithdrawalScreen />,
            // 안내 카드가 회색이라 화면은 흰 면이어야 한다(Figma 3524:152473).
            // 하단 고정 버튼(Action Area)이 있어 Bottom Nav는 없다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/settings/withdrawal",
          },
          {
            element: <WithdrawalCompleteScreen />,
            // 완료 화면 — 하단 탭 없이 흰 배경 전체 화면이다(Figma 3524:152505)
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/settings/withdrawal/complete",
          },
          {
            element: <LockersApplyScreen />,
            // 시트만 있는 화면이라 뒤에 Bottom Nav가 비쳐도 Figma(홈 위에 뜨는 시트)와 같다
            path: "/lockers/apply",
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
            element: <NotificationsScreen />,
            // Figma 알림 화면에는 Bottom Nav가 없고(뒤로가기로 진입한 화면에 복귀) 배경이 흰 면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/notifications",
          },
          {
            element: <NotificationsSettingsScreen />,
            // 알림 화면의 설정 아이콘으로 들어가는 화면 — 알림 화면과 같은 이유로 Bottom Nav 없이 흰 면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/notifications/settings",
          },
          {
            element: <AuthSignupScreen />,
            // 로그인·온보딩 퍼널 하나가 모든 단계(로그인, 연락처, 약관 동의, 약관 상세, 가입 완료)를 그린다.
            // Figma 로그인·온보딩에는 Bottom Nav가 없고 배경이 흰 면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/auth",
          },
          {
            element: <KConnectCallbackScreen />,
            // K-CONNECT 인증 후 되돌아오는 redirect URI — 경로는 K-CONNECT에 등록한 값(@billilge/oauth-kconnect 규약)이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/oauth/kconnect",
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
            element: <LockersCellSelectScreen />,
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
          {
            // 아카이빙 화면은 모두 하단 탭 없이 흰 배경이라, element 없는 부모 라우트에 옵션을 모은다
            children: [
              { element: <ArchivesListScreen />, path: "/archives" },
              {
                element: <ArchivesDetailScreen />,
                path: "/archives/:archiveId",
              },
              {
                element: <ArchivesPhotosScreen />,
                path: "/archives/:archiveId/photos",
              },
              {
                element: <ArchivesPhotoViewerScreen />,
                path: "/archives/:archiveId/photos/:photoIndex",
              },
            ],
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
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
