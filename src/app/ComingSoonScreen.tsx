import { Typography } from "@wanteddev/wds";

// 라우트가 없는 경로(아직 만들지 않은 탭 화면 등)에 보여주는 화면 — router.tsx에서 레이아웃 라우트 안에
// path "*"로 둬서, 하단 탭이 그대로 남아 다른 화면으로 돌아갈 수 있다.
function ComingSoonScreen() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label1"
        weight="regular"
      >
        아직 준비 중인 화면이에요
      </Typography>
    </div>
  );
}

export default ComingSoonScreen;
