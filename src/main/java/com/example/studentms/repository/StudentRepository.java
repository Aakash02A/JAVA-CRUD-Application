package com.example.studentms.repository;

import com.example.studentms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // JpaRepository already gives us save, findAll, findById, delete, etc.
}
