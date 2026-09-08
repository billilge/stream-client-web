import RentalListScreen from "@/features/rental/RentalListScreen";

// 라우팅 도입 전까지 임시로 이 화면만 렌더링한다. 데스크톱에서 보기 좋게 아이폰 화면 크기로 가운데 정렬만 해준다.
function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] py-6">
      <RentalListScreen />
    </div>
  );
}

export default App;
