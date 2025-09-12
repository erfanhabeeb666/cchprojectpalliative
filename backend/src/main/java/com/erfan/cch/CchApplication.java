package com.erfan.cch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class CchApplication {

	public static void main(String[] args) {
		SpringApplication.run(CchApplication.class, args);
	}

}
