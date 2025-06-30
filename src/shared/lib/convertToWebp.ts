const convertToWebP = (file: File, quality: number = 1.0): Promise<File> => {
  return new Promise((resolve, reject) => {
    // 품질 값 유효성 검사
    if (quality < 0 || quality > 1) {
      reject(new Error('품질 값은 0.0에서 1.0 사이여야 합니다.'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas 컨텍스트를 생성할 수 없습니다.'));
      return;
    }

    img.onload = () => {
      try {
        // 캔버스 크기를 이미지 크기로 설정
        canvas.width = img.width;
        canvas.height = img.height;

        // 이미지를 캔버스에 그리기
        ctx.drawImage(img, 0, 0);

        // 캔버스를 WebP로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // 원본 파일명에서 확장자를 .webp로 변경
              const originalName = file.name.replace(/\.[^/.]+$/, "");
              const webpFile = new File([blob], `${originalName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              
              console.log(`이미지 변환 완료: ${file.name} -> ${webpFile.name}`);
              console.log(`파일 크기: ${(file.size / 1024).toFixed(2)}KB -> ${(webpFile.size / 1024).toFixed(2)}KB`);
              
              resolve(webpFile);
            } else {
              reject(new Error('WebP 변환에 실패했습니다.'));
            }
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(new Error(`이미지 처리 중 오류 발생: ${error}`));
      }
    };

    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'));
    };

    // 파일을 이미지로 로드
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('파일 읽기에 실패했습니다.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
    };
    
    reader.readAsDataURL(file);
  });
};

export default convertToWebP;