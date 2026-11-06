interface BillilgeItemIconProps {
  // 서버 물품 아이콘 주소. 아이콘을 안 올렸거나 지워진 물품은 null이라 회색 칸만 둔다
  src: string | null;
}

// 서버 물품 아이콘(SVG)을 42px에 꽉 채우면 원본 여백 없이 커 보여서, 어드민(stream-admin-client
// RentalItemIcon)처럼 42px 회색 칸 가운데에 최대 28px로 비율을 지켜 넣는다.
// radius는 어드민과 같은 10px인데 Tailwind 단계엔 8px(lg)·12px(xl)뿐이라 임의값으로 둔다.
function BillilgeItemIcon({ src }: BillilgeItemIconProps) {
  return (
    <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] bg-background-alternative">
      {src && (
        <img alt="" className="max-h-7 max-w-7 object-contain" src={src} />
      )}
    </div>
  );
}

export default BillilgeItemIcon;
