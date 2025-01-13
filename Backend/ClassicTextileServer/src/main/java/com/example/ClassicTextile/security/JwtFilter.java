package com.example.ClassicTextile.security;

import com.auth0.jwt.JWT;
import com.example.ClassicTextile.modules.ServerState;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
@Order(2) // run AFTER CorsFilter
public class JwtFilter extends OncePerRequestFilter {
        private Map<String, ServerState> activeTokens;

    public JwtFilter(Map<String,ServerState> activeTokens) { //dependency enjection
        this.activeTokens = activeTokens;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                throw new Exception("Missing or invalid Authorization header");
            }

            token = token.replace("Bearer ", "");

            JWT.decode(token);
            if (!activeTokens.containsKey(token)) {
                throw new Exception("Token not found. please log in. ");
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());

            // Set HTTP response to 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
        }
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/auth")||request.getServletPath().startsWith("/fabric/category")||request.getServletPath().equals("/fabric/allFabrics") ;
//        return true;
    }
}