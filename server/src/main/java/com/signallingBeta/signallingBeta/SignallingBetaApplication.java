package com.signallingBeta.signallingBeta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SignallingBetaApplication {

	public static void main(String[] args) { SpringApplication.run(SignallingBetaApplication.class, args); }

}
