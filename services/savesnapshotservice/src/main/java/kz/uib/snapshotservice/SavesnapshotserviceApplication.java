package kz.uib.snapshotservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@ComponentScan
@SpringBootApplication
@Configuration
@EnableAutoConfiguration
public class SavesnapshotserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SavesnapshotserviceApplication.class, args);
	}

}
