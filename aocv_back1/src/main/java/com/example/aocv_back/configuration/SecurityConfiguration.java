package com.example.aocv_back.configuration;


import com.example.aocv_back.jwt.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(httpSecurityCorsConfigurer -> {

                })
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(httpSecurityHttpBasicConfigurer -> {
                    httpSecurityHttpBasicConfigurer.disable();
                })
                .sessionManagement(httpSecuritySessionManagementConfigurer -> {
//                    httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> {
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/sign-up/**").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/sign-in/**").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/sign-out/**").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/check-userid").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/find-id").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/find-pw").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/modify/**").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/delete").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/check-password").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/get-address").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/update-address").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/auth/kakao").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/auth/naver").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/auth/google").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/auth/google/additional-info").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/item/list/**").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/item/{id}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/admin/**").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/cart/add-item").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/cart/items").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/cart/delete-items").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/review/add-review").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/review/item/{itemId}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/cart/update-item").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/review/delete/{reviewId}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/item/random-items").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/review/mark-best/{itemId}/{reviewId}").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/review/unmark-best/{itemId}/{reviewId}").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/admin/review/list").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/notice/create").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/notice/list").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/payments/confirm").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/items/{itemId}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/{orderId}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/notice/{id}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/notice/modify").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/notice/delete/{id}").hasRole("ADMIN");
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/address/{id}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/refund").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/refund-requests").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/shippingcost").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/user/points").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/shipments/{trackingNumber}").permitAll();
                    authorizationManagerRequestMatcherRegistry.requestMatchers("/order/{orderId}/status").permitAll();
                    authorizationManagerRequestMatcherRegistry.anyRequest().authenticated();
                })
                .addFilterAfter(jwtAuthenticationFilter, CorsFilter.class)
                .build();

    }
}



