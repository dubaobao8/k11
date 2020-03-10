import request from "@/api";

// 从后端获取微信JS SDK配置信息
export const GetWXSdkConfig = () => request.post("/api/report/test",{
  url:location.href.split('#')[0]
});
