package com.erfan.cch.Models;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    public Admin(Long id, String name, String email, String password) {
        super(id, name, email, password);
    }

    public Admin() {
    }
}

