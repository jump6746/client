import { useState, useEffect, useRef } from "react";

interface UseDragOptions {
  minHeight: number;
  maxHeight: number;
  initialHeight?: number;
  snapThreshold?: number; // 스냅 임계값 (0~1, 기본값 0.5)
  onHeightChange?: (height: number) => void;
}

interface UseDragReturn {
  currentHeight: number;
  dragPosition: number;
  isDragging: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  setHeight: (height: number) => void;
  resetToMinHeight: () => void;
  expandToMaxHeight: () => void;
}

const useDrag = ({
  minHeight,
  maxHeight,
  initialHeight,
  snapThreshold = 0.5,
  onHeightChange
}: UseDragOptions): UseDragReturn => {
  const [dragPosition, setDragPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number>(initialHeight || minHeight);
  
  const dragStartHeight = useRef<number>(0);

  // 높이 변경 시 콜백 호출
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(currentHeight);
    }
  }, [currentHeight, onHeightChange]);

  // 초기 높이 설정
  useEffect(() => {
    if (initialHeight && initialHeight !== currentHeight) {
      setCurrentHeight(initialHeight);
      setDragPosition(initialHeight - minHeight);
    }
  }, [initialHeight, minHeight, currentHeight]);

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    dragStartHeight.current = currentHeight;
  };

  // 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // 위로 드래그하면 양수
    const newHeight = Math.max(minHeight, Math.min(maxHeight, dragStartHeight.current + deltaY));
    
    setDragPosition(newHeight - minHeight);
    setCurrentHeight(newHeight);
  };

  // 터치 종료
  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    snapToNearestPosition();
  };

  // 마우스 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    dragStartHeight.current = currentHeight;
  };

  // 마우스 이동
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, dragStartHeight.current + deltaY));
    
    setDragPosition(newHeight - minHeight);
    setCurrentHeight(newHeight);
  };

  // 마우스 종료
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    snapToNearestPosition();
  };

  // 스냅 위치 계산
  const snapToNearestPosition = () => {
    const heightRange = maxHeight - minHeight;
    const currentProgress = (currentHeight - minHeight) / heightRange;
    
    let targetHeight: number;
    
    if (currentProgress < snapThreshold) {
      targetHeight = minHeight;
    } else {
      targetHeight = maxHeight;
    }
    
    setCurrentHeight(targetHeight);
    setDragPosition(targetHeight - minHeight);
  };

  // 특정 높이로 설정
  const setHeight = (height: number) => {
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    setCurrentHeight(clampedHeight);
    setDragPosition(clampedHeight - minHeight);
  };

  // 최소 높이로 리셋
  const resetToMinHeight = () => {
    setCurrentHeight(minHeight);
    setDragPosition(0);
  };

  // 최대 높이로 확장
  const expandToMaxHeight = () => {
    setCurrentHeight(maxHeight);
    setDragPosition(maxHeight - minHeight);
  };

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY, dragStartHeight.current]);

  return {
    currentHeight,
    dragPosition,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    setHeight,
    resetToMinHeight,
    expandToMaxHeight
  };
};

export default useDrag;