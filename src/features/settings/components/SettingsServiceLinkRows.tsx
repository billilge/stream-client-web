import { useSuspenseQuery } from "@tanstack/react-query";

import SettingsRow from "@/features/settings/components/SettingsRow";
import { openExternalLink } from "@/lib/openExternalLink";
import {
  serviceLinksQueries,
  toOpenableUrl,
} from "@/shared/entities/service-links/serviceLinksQueries";

// 서비스 정보 카드(Figma 3524:152349)의 의견 보내기·개인정보 처리방침 두 행. 화면을 따로 만들지 않고
// 서버가 주는 외부 링크(구글폼·노션)를 연다 — Figma의 개인정보 처리방침 화면(3524:152427)은 노션
// 페이지가 대신한다. 받는 동안은 SettingsScreen의 Suspense가 SettingsServiceLinkRowsSkeleton을 보여 준다.
//
// 운영진이 링크를 등록하지 않았으면(null) 그 행을 비활성으로 그린다 — 누를 수 있어 보이는데 반응이
// 없는 상태를 피한다. Figma에는 이 비활성 상태가 없다(디자인에는 링크가 있다고 보고 그려져 있다).
// `https://`가 아닌 주소도 toOpenableUrl이 걸러서 링크가 없을 때와 같게 비활성으로 그린다.

function SettingsServiceLinkRows() {
  const { data } = useSuspenseQuery(serviceLinksQueries.all());
  const feedbackFormUrl = toOpenableUrl(data.feedbackFormUrl);
  const privacyPolicyUrl = toOpenableUrl(data.privacyPolicyUrl);

  // 링크가 없으면 행이 disabled라 눌리지 않지만, 타입상 null을 걸러야 열 수 있다
  const openLink = (url: string | null) => {
    if (url) {
      openExternalLink(url);
    }
  };

  return (
    <>
      <SettingsRow
        disabled={!feedbackFormUrl}
        label="의견 보내기"
        onClick={() => openLink(feedbackFormUrl)}
      />
      <SettingsRow
        disabled={!privacyPolicyUrl}
        label="개인정보 처리방침"
        onClick={() => openLink(privacyPolicyUrl)}
      />
    </>
  );
}

export default SettingsServiceLinkRows;
