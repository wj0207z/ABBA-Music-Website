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
                    "/api/health",
                    "/api/posts",
                    "/api/csrf"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/register"
                ).permitAll()

                .anyRequest().authenticated()
            )
            .requestCache(cache -> cache.disable())
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                })
            )

            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(204);
                })
            )

            .formLogin(form -> form
                .loginProcessingUrl("/api/login")
                .usernameParameter("email")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(204);
                })
                .failureHandler((request, response, exception) -> {
                    response.setStatus(401);
                })
                .permitAll()
            );

            return http.build();
    }
}
