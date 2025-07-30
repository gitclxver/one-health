package com.example.BlogAPI.Repositories;


import com.example.BlogAPI.Models.OneTimeCodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OneTimeCoderepo extends JpaRepository<OneTimeCodeModel,Long> {
    OneTimeCodeModel findByCode(int pin);

    void deleteByCode(int pin);
    Boolean existsByCode(int pin);
}
