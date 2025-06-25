const Marker = () => {
  return (
    <div className="relative">
      {/* 메인 마커 (파란색 원) */}
      <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg relative z-10" />

      {/* 펄스 애니메이션 */}
      <div className="absolute top-0 left-0 w-5 h-5 bg-blue-500 bg-opacity-30 rounded-full animate-ping" />

      {/* 외부 원 */}
      <div className="absolute -top-2 -left-2 w-9 h-9 bg-blue-500 bg-opacity-10 rounded-full" />
    </div>
  );
};

export default Marker;
