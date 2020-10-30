package kz.uib.snapshotservice.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class Snapshot {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	private String streamName;
	private String barCode;
	private String exam;
	private String dt;
	private String descr;
	@Lob
	@Column(columnDefinition = "TEXT")
	private String imgb64;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getStreamName() {
		return streamName;
	}
	public void setStreamName(String streamName) {
		this.streamName = streamName;
	}
	public String getBarCode() {
		return barCode;
	}
	public void setBarCode(String barCode) {
		this.barCode = barCode;
		
	}
	public String getExam() {
		return exam;
	}
	public void setExam(String exam) {
		this.exam = exam;
	}
	public String getDt() {
		return dt;
	}
	public void setDt(String dt) {
		this.dt = dt;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	public String getImgb64() {
		return imgb64;
	}
	public void setImgb64(String imgb64) {
		this.imgb64 = imgb64;
	}

}
