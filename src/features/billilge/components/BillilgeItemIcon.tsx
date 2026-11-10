interface BillilgeItemIconProps {
  // 아이콘이 없는 물품은 null이라 빈 회색 칸만 둔다
  src: string | null;
}

function BillilgeItemIcon({ src }: BillilgeItemIconProps) {
  return (
    <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] bg-background-alternative">
      {src && (
        <img alt="" className="max-h-8 max-w-8 object-contain" src={src} />
      )}
    </div>
  );
}

export default BillilgeItemIcon;
