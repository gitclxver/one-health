package com.example.BlogAPI.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "one_time_pin")
public class OneTimeCodeModel {
    @Id
    @Column(name = "otp_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otp_id;

    @Column(name = "pin_code",nullable = false)
    private int code;
    @OneToOne
    @JoinColumn(name = "userId",referencedColumnName = "userId")
    @NotNull(message = "where is the userId?!!?, because i don't see it!!!!!, give me the userId")
    private user user;

    public com.example.BlogAPI.Models.user getUser() {
        return user;
    }

    public void setUser(com.example.BlogAPI.Models.user user) {
        this.user = user;
    }

    public Long getOtp_id() {
        return otp_id;
    }

    public void setOtp_id(Long otp_id) {
        this.otp_id = otp_id;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

}
