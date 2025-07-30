package com.example.BlogAPI.controllers;

import com.example.BlogAPI.Models.AlluserDTO;
import com.example.BlogAPI.Models.LoginDTO;
import com.example.BlogAPI.Models.user;
import com.example.BlogAPI.Models.userDTO;
import com.example.BlogAPI.Services.userServices.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(name = "/api/v1/user")
public class userController {
    private final Login login;
    private final getuserById getuserById;
    private final getAllUsers getall;

    private final signup signup;
    private final LoginWithCode LoginWC;

    public userController(Login login, com.example.BlogAPI.Services.userServices.getuserById getuserById, getAllUsers getall, com.example.BlogAPI.Services.userServices.signup signup, LoginWithCode loginWC) {
        this.login = login;
        this.getuserById = getuserById;
        this.getall = getall;
        this.signup = signup;
        LoginWC = loginWC;
    }

    @PostMapping
    public ResponseEntity<String> signup(@Valid @RequestBody user input){
        return signup.execute(input);
    }

    @GetMapping("/loginWithCode")
    public ResponseEntity<String> loginWithCode(@RequestParam(name = "code") Integer code){
        return LoginWC.execute(code);
    }

    @GetMapping("/Login")
    public ResponseEntity<userDTO> login(@Valid @RequestBody LoginDTO loginCredentials){
        return login.execute(loginCredentials);
    }

    @GetMapping("/getAllusers")
    public ResponseEntity<List<AlluserDTO>> getAlluser(){
        return getall.getAllusers();
    }
    @GetMapping("/getuser")
    public ResponseEntity<user> getUserById(@RequestParam("Id") Long Id){
        return getuserById.execute(Id);
    }

}
