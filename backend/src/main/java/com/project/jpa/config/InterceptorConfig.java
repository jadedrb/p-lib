/*
 * 
 * This class is not in use currently and can be deleted (potentially).
 * 
 * 
 */



package com.project.jpa.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
	
	@Autowired
	RequestHeaderInterceptor requestHeaderInterceptor;
	
	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		registry.addInterceptor(requestHeaderInterceptor).addPathPatterns("/api/**");
	}
	
	
	
	
}



