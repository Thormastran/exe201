import * as dns from 'dns';

// Tránh querySrv ECONNREFUSED trên Windows khi DNS mặc định không trả lời SRV
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
