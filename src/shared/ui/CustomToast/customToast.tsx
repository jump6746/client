import { toast } from "sonner";

const customToast = {
  success: (message: string) => {
    toast.custom((id) => (
      <div className="relative bg-green-50 border border-green-200 rounded-lg p-4 pr-12 max-w-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
          <div>
            <p className="text-sm text-green-700 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="absolute top-3 right-3 text-green-400 hover:text-green-600"
        >
          ✕
        </button>
      </div>
    ));
  },

  error: (message: string) => {
    toast.custom((id) => (
      <div className="relative bg-red-50 border border-red-200 rounded-lg p-4 pr-12 max-w-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            !
          </div>
          <div>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    ));
  },

  // 로딩만 처리하는 함수
  loading: (message: string) => {
    return toast.custom(() => (
      <div className="relative bg-blue-50 border border-blue-200 rounded-lg p-4 pr-12 max-w-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-sm text-blue-700 mt-1">{message}</p>
          </div>
        </div>
      </div>
    ));
  },

  needLogin: (callback: () => void) => {
    toast.custom((id) => (
      <div className="relative bg-brand-primary-600 rounded-3xl w-xs py-10 shadow-lg flex items-center justify-center">
        <p className="text-md text-white mt-1 font-semibold">
          로그인이 필요합니다.
        </p>
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          className="absolute -top-1 -right-1 text-black bg-white px-1 text-center rounded-full text-sm cursor-pointer hover:bg-gray-200"
        >
          ✕
        </button>
        <button
          type="button"
          className="absolute bottom-2 right-2 text-white cursor-pointer text-xs"
          onClick={() => {
            toast.dismiss(id);
            callback();
          }}
        >
          로그인하기 ▶
        </button>
      </div>
    ));
  },
};

export default customToast;
