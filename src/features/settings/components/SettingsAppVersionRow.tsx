import { useSuspenseQuery } from "@tanstack/react-query";

import { usersQueries } from "@/entities/users/usersApi";
import SettingsRow from "@/features/settings/components/SettingsRow";

// 앱 버전 행(Figma 3524:152356) — 서버는 버전과 최신 여부를 따로 주고, Figma 표기("26.0.1 ·
// 최신버전")는 화면이 조합한다. 최신이 아닐 때 문구는 디자인에 없어서 버전만 보여 준다.
function SettingsAppVersionRow() {
  const {
    data: { version, isLatest },
  } = useSuspenseQuery(usersQueries.appVersion());

  return (
    <SettingsRow
      label="앱 버전"
      value={isLatest ? `${version} · 최신버전` : version}
    />
  );
}

export default SettingsAppVersionRow;
