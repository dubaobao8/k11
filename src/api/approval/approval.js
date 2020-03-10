import request from "@/api";

// 一键审批操作
export const AgreeMultipleIncidentAndPatrolReports = (content, star, port_id) => {
  return request.post('/api/news/ReportCheckAgree', {content, star, port_id})
};

export const RejectMultipleIncidentAndPatrolReports = (content, star, port_id) => {
  return request.post('/api/news/ReportCheckRefuse', {content, star, port_id})
};
