import request from "@/api";

export const GetReportStatistics = () => request.post('/api/news/Census');
