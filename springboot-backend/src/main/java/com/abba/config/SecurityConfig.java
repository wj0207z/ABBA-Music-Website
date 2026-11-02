package com.abba.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.DispatcherType;

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http
    ) throws Exception {

        http
            .authorizeHttpRequests(authorize -> authorize
                .dispatcherTypeMatchers(
                    DispatcherType.ERROR
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/posts",
                    "/api/posts/*",
                    "/api/health"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/register"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/posts"
                ).authenticated()

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/posts/*"
                ).denyAll()

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/posts/*"
                ).denyAll()

                .anyRequest().authenticated()
            )

            .formLogin(formLogin -> formLogin
                .defaultSuccessUrl("/api/me", true)
                .permitAll()
            );

            return http.build();
    }
}
