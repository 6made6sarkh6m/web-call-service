package kz.uib.snapshotservice.model;

import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;


public interface SnapshotRepository extends PagingAndSortingRepository<Snapshot,Long>{
	Iterable<Snapshot> findAllByBarCodeAndStreamNameAndExam(String barCode, String streamName, String exam);
}
