package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.service.CatchupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/catchup")
@CrossOrigin("*")
public class CatchupController {

    @Autowired
    private CatchupService catchupService;

    @GetMapping("/generateRoomID")
    public String generateNewUniqueRoomID() {
        return catchupService.generateUniqueRoomID();
    }

}
