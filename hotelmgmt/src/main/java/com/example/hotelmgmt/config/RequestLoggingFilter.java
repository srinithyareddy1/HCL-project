package com.example.hotelmgmt.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import java.io.IOException;
import java.time.Instant;

@Component
public class RequestLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest)  req;
        HttpServletResponse response = (HttpServletResponse) res;

        ContentCachingRequestWrapper  wrappedReq = new ContentCachingRequestWrapper(request, Integer.MAX_VALUE);
        ContentCachingResponseWrapper wrappedRes = new ContentCachingResponseWrapper(response);

        String method = wrappedReq.getMethod();
        String uri    = wrappedReq.getRequestURI();

        String authHeader = wrappedReq.getHeader("Authorization");
        String caller     = "anonymous";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String[] parts = token.split("\\.");
                if (parts.length == 3) {
                    String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
                    int subIdx = payload.indexOf("\"sub\":\"");
                    if (subIdx >= 0) {
                        int start = subIdx + 7;
                        int end   = payload.indexOf("\"", start);
                        caller    = payload.substring(start, end);
                    }
                }
            } catch (Exception ignored) {}
        }

        log.info("➡  {} {}  ({})", method, uri, caller);
        long start = Instant.now().toEpochMilli();

        try {
            chain.doFilter(wrappedReq, wrappedRes);
        } finally {
            long elapsed = Instant.now().toEpochMilli() - start;
            int  status  = wrappedRes.getStatus();
            if (status >= 400) {
                log.warn("❌ {} {} → {}  ({} ms)", method, uri, status, elapsed);
            } else {
                log.info("✅ {} {} → {}  ({} ms)", method, uri, status, elapsed);
            }
            wrappedRes.copyBodyToResponse();
        }
    }
}
