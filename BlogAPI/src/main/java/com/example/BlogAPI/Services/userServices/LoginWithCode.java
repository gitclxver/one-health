package com.example.BlogAPI.Services.userServices;


import com.example.BlogAPI.Exceptions.codeDoesntExistException;
import com.example.BlogAPI.Repositories.Command;
import com.example.BlogAPI.Repositories.OneTimeCoderepo;
import com.example.BlogAPI.Repositories.userRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

@Service
public class LoginWithCode implements Command<Integer, String> {
    private final OneTimeCoderepo OTP;
    private final AuthenticationManager manager;
    private final userRepository userRepo;

    public LoginWithCode(OneTimeCoderepo otp, AuthenticationManager manager, userRepository userRepo) {
        OTP = otp;
        this.manager = manager;
        this.userRepo = userRepo;
    }
    @Transactional
    @Override
    public ResponseEntity<String> execute(Integer input) {
        if(OTP.existsByCode(input)) {
            Long otpId = OTP.findByCode(input).getOtp_id();
            OTP.deleteById(otpId);
            return ResponseEntity.ok().body("Success");
        }else {
            throw new codeDoesntExistException();
        }

    }
}
