/*
 * 
 * This class is not in use currently and can be deleted (potentially).
 * 
 * 
 */



package com.project.jpa.config;

import java.security.Principal;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;



@Component
public class RequestHeaderInterceptor implements HandlerInterceptor {
	
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		
		try {
			
//			Principal principal = request.getUserPrincipal();
//	        System.out.println(principal.getName() + " : interceptor");
			
//	        System.out.println(response);
//	        System.out.println(request);
//	        System.out.println(handler);
//	        HandlerMethod method = (HandlerMethod) handler;
//	        System.out.println(handler.getClass().getName());
		} catch (Exception e) {
			System.out.println("something went wrong here");
		}
		
//		return HandlerInterceptor.super.preHandle(request, response, handler);
		return true;
	}
	
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
	} 
	
}
