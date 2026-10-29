import { useSuspenseQuery } from "@tanstack/react-query";

import { usersQueries } from "@/entities/users/usersApi";
import SettingsRow from "@/features/settings/components/SettingsRow";

interface SettingsAccountRowsProps {
  onChangePhone: () => void;
}

// 계정 정보 카드(Figma 3524:152331)의 세 행 — 서버에서 받는 값이라 카드 안쪽만 데이터 컴포넌트로
// 뺀다. 받는 동안은 SettingsScreen의 Suspense가 SettingsAccountRowsSkeleton을 보여준다.
// 카드 껍데기(SettingsSection)와 "계정 정보" 라벨은 데이터와 무관해서 화면이 바로 그린다.
function SettingsAccountRows({ onChangePhone }: SettingsAccountRowsProps) {
  const { data: account } = useSuspenseQuery(usersQueries.myAccount());

  return (
    <>
      <SettingsRow label="이름" value={account.name} variant="account" />
      <SettingsRow label="이메일" value={account.email} variant="account" />
      <SettingsRow
        label="전화번호"
        onClick={onChangePhone}
        value={account.phone}
        variant="account"
      />
    </>
  );
}

export default SettingsAccountRows;
