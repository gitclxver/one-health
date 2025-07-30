package com.example.BlogAPI.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

@Entity
public class article {
    @Id
    @GeneratedValue
    @Column(insertable = false,updatable = false)
    private long articleId;
    @NotNull(message = "Title missing")
    private String title;

    private String Description;

    @ManyToMany(mappedBy = "wroteArticles")
    Set<user> wrote;

}
