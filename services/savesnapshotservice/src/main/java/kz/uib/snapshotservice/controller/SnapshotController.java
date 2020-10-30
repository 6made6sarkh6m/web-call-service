package kz.uib.snapshotservice.controller;

import java.io.FileOutputStream;
import java.util.Date;
import java.util.Optional;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kz.uib.snapshotservice.model.Snapshot;
import kz.uib.snapshotservice.model.SnapshotRepository;
import kz.uib.snapshotservice.util.ImgLoad;


@RestController
@RequestMapping(path = "/snapshot")
public class SnapshotController {

	@Autowired
	private SnapshotRepository snapshotRepository;
	
	@GetMapping(path = "/add")
	public @ResponseBody String addSnapshot(@RequestParam(name = "strname") String strname, @RequestParam byte[] imgb64) {
		/*
		try {
			byte[] imageByte=imgb64;

			String directory="D://sample.png";

			new FileOutputStream(directory).write(imageByte);
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		*/
		String[] par = strname.split("_");
		if (par.length<3) {
			return "dont save:"+strname;
		}
		
		Snapshot s = new Snapshot();
		s.setStreamName(par[0]);
		s.setBarCode(par[1]);
		s.setExam(par[2]);
		s.setDescr("violation");
		String dt = ""+new Date().getTime();  
		s.setDt(dt);
		try {
			s.setImgb64(Base64Utils.encodeToString(imgb64));
		}
		catch (Exception e) {
			s.setImgb64("not img");
		}
				
//		s.setId(1);
		snapshotRepository.save(s);
		return "save:"+strname;
	}
	@PostMapping(path = "/save")
	public @ResponseBody String saveSnapshot(@RequestBody ImgLoad imgb64) {
		/*
		try {
			byte[] imageByte=Base64.decodeBase64(imgb64.getImgb64());

			String directory="D://sample.png";

			new FileOutputStream(directory).write(imageByte);
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		*/
		String[] par = imgb64.getStrname().split("_");
		Snapshot s = new Snapshot();
		s.setStreamName(par[0]);
		s.setExam("0000");
		s.setBarCode("0000000");
//		if (par.length<3) {
//			return "dont save:"+imgb64.getStrname();
//		}
		if (par.length>=3) {
			s.setExam(par[2]);

		}
		if(par.length>=2) {
			s.setBarCode(par[1]);
		}
		
		s.setDescr("violation");
		String dt = ""+new Date().getTime();  
		s.setDt(dt);
		s.setImgb64(imgb64.getImgb64());
		//s.setId(1);
		snapshotRepository.save(s);
		return "Сохранено:"+imgb64.getStrname();
	}

	@GetMapping(path = "/all")
	public @ResponseBody Iterable<Snapshot> getAllSnapshot(){
		return snapshotRepository.findAll();
	}
	
	@GetMapping(path = "/findById")
	public @ResponseBody Optional<Snapshot> findByID(@RequestParam long id){
		return snapshotRepository.findById(id);
	}
	@GetMapping(path = "/findByPar")
	public @ResponseBody Iterable<Snapshot> findByPar(@RequestParam String barCode,@RequestParam String streamName, @RequestParam String exam){
		return snapshotRepository.findAllByBarCodeAndStreamNameAndExam(barCode, streamName, exam);
	}
}
