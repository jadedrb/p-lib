package com.project.jpa.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.jpa.services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	JwtFilter jwtFilter;
	
	@Autowired
	CustomUserDetailsService userDetailsService;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(encodePW());
//		super.configure(auth);
	}
	
	@Bean
	public BCryptPasswordEncoder encodePW() {
		return new BCryptPasswordEncoder();
	} 
	
	@Bean(name = BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests().antMatchers("/api/auth/**")
                .permitAll().anyRequest().authenticated()
                .and().exceptionHandling().and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);;
    }
	
	
   
}









//@RestController
//class BasicController {
//  @Autowired
//  private JwtUtil jwtUtil;
//
//  // injecting authentication manager
//  @Autowired
//  private AuthenticationManager authenticationManager;
//
//  @PostMapping("login")
//  public ResponseEntity<String> login(@RequestBody LoginRequestDTO request) {
//      // Creating UsernamePasswordAuthenticationToken object
//      // to send it to authentication manager.
//      // Attention! We used two parameters constructor.
//      // It sets authentication false by doing this.setAuthenticated(false);
//      UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
//      // we let the manager do its job.
//      authenticationManager.authenticate(token);
//      // if there is no exception thrown from authentication manager,
//      // we can generate a JWT token and give it to user.
//      String jwt = jwtUtil.generate(request.getUsername());
//      return ResponseEntity.ok(jwt);
//  }
//
//  @GetMapping("/hello")
//  public ResponseEntity<String> get(){
//      return ResponseEntity.ok("Hello");
//  }
//}
//
//@Data
//@NoArgsConstructor
//class LoginRequestDTO {
//  private String username;
//  private String password;
//}