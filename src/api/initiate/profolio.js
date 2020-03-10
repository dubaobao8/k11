import request from "@/api";

export const GetProfolio  = () => request.post('/api/profolio/userlist');
