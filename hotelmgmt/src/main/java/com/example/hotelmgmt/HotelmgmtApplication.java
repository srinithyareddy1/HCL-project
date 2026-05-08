package com.example.hotelmgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HotelmgmtApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelmgmtApplication.class, args);
	}
}
