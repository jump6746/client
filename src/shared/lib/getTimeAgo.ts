const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  
  // 밀리초 단위 차이 계산
  const diffMs = now.getTime() - past.getTime();
  
  // 각 단위별 밀리초
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  // 미래 날짜인 경우
  if (diffMs < 0) {
    return "방금 전";
  }
  
  // 1분 미만
  if (diffMs < minute) {
    return "방금 전";
  }
  
  // 1시간 미만
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes}분 전`;
  }
  
  // 1일 미만
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours}시간 전`;
  }
  
  // 1주 미만
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days}일 전`;
  }
  
  // 1개월 미만
  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks}주 전`;
  }
  
  // 1년 미만
  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months}개월 전`;
  }
  
  // 1년 이상
  const years = Math.floor(diffMs / year);
  return `${years}년 전`;
}

export default getTimeAgo;