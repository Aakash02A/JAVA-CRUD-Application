package com.example.studentms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * We pull in Spring Security ONLY for its excellent, battle-tested
 * BCryptPasswordEncoder (secure password hashing).
 *
 * We are NOT using Spring Security's login form, AuthenticationManager or
 * UserDetailsService. Instead, actual login/logout and route protection are
 * handled by our own AuthController + AuthInterceptor using a plain
 * HttpSession. This keeps things beginner-friendly while still hashing
 * passwords properly.
 *
 * Because of that, we tell Spring Security to permit all requests through
 * its filter chain (our own interceptor does the real gate-keeping for
 * /api/students/**) and we disable CSRF + the default login page/http basic
 * popup, which would otherwise get in the way of a JSON/fetch-based API.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
