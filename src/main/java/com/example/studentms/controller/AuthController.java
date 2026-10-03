package com.example.studentms.controller;

import com.example.studentms.dto.AuthResponse;
import com.example.studentms.dto.LoginRequest;
import com.example.studentms.dto.MessageResponse;
import com.example.studentms.dto.RegisterRequest;
import com.example.studentms.model.User;
import com.example.studentms.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            AuthResponse response = new AuthResponse(
                    user.getId(), user.getUsername(), user.getEmail(), "Registration successful"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse(e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        try {
            User user = userService.authenticate(request.getUsername(), request.getPassword());

            // Store the logged-in user's id in the session.
            // This session id is tracked via the JSESSIONID cookie the
            // browser automatically sends back on every future request.
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            AuthResponse response = new AuthResponse(
                    user.getId(), user.getUsername(), user.getEmail(), "Login successful"
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse(e.getMessage()));
        }
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }

    // GET /api/auth/me  -> used by the dashboard to check "am I logged in?"
    @GetMapping("/me")
    public ResponseEntity<?> currentUser(HttpSession session) {
        Object userId = session.getAttribute("userId");
        Object username = session.getAttribute("username");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not logged in"));
        }

        return ResponseEntity.ok(new AuthResponse((Long) userId, (String) username, null, "Authenticated"));
    }
}
