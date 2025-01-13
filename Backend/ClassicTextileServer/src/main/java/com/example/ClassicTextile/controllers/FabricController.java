package com.example.ClassicTextile.controllers;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.ClassicTextile.exceptions.FabricWasNotFoundException;
import com.example.ClassicTextile.modules.Fabric;
import com.example.ClassicTextile.modules.enums.Category;
import com.example.ClassicTextile.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/fabric")
public class FabricController {
    private AdminService adninService;

    public FabricController(AdminService adminService) {
        this.adninService = adminService;
    }
    @GetMapping("/allFabrics")
    private List<Fabric> getAllFabrics(){
        return adninService.getAllFabrics();

    }
    @GetMapping("oneFabric")
    public ResponseEntity<?> getFabricById( int id,@RequestHeader("Authorization") String token) throws FabricWasNotFoundException {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add fabric");
        }

       return ResponseEntity.ok( adninService.getOneFabric(id));
    }
    @DeleteMapping
    public ResponseEntity<String> deleteFabric( int id,@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add fabric");
        }
          adninService.deleteOneFabric(id);
        return ResponseEntity.ok("Fabric was deleted");

    }

    @GetMapping("/category/{category}")
    public List<Fabric> getFabricByCategory(@PathVariable String category) {
        Category categoryEnum = Category.valueOf(category.toUpperCase());
        return adninService.getFabricByCategory(categoryEnum);
    }
    @PostMapping("/addFabric")
    public ResponseEntity<String> addFabric(@RequestBody Fabric fabric,@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add fabric");
        }
        adninService.addFabric(fabric);
        return ResponseEntity.ok("Fabric was added");
    }
    @PutMapping ("oneFabric")
    public ResponseEntity<String> updateFabric( @RequestBody Fabric fabric,@RequestHeader("Authorization") String token)  {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update fabric");
        }
         adninService.updateFabric(fabric);
        return ResponseEntity.ok("Fabric was updated");

    }



}

