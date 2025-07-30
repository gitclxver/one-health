package com.example.BlogAPI.Models;

import com.example.BlogAPI.Enum.userType;

public class AlluserDTO {
        private Long userId;

        private userType userRole;

        private String firstName;

        private String lastName;
        private String email;
        private String jwt;

        public AlluserDTO(user loginUser) {
            this.userId = loginUser.getUserId();
            this.userRole = loginUser.getUserRole();
            this.firstName = loginUser.getFirstName();
            this.lastName = loginUser.getLastName();
            this.email = loginUser.getEmail();
        }

}
