package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.*;
import com.erfan.cch.Models.*;
import com.erfan.cch.Services.AdminService;
import com.erfan.cch.Services.ConsumableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ConsumableService consumableService;

    public AdminController(AdminService adminService, ConsumableService consumableService) {
        this.adminService = adminService;
        this.consumableService = consumableService;
    }

    // ───── Procedure ─────
    @PostMapping("/procedure")
    public ResponseEntity<String> addProcedure(@RequestParam String name) {
        adminService.addProcedure(name);
        return ResponseEntity.ok("Procedure added successfully");
    }

    @GetMapping("/procedures")
    public ResponseEntity<List<ProcedureDoneDto>> getAllProcedures() {
        return ResponseEntity.ok(adminService.getAllProcedures());
    }

    // ───── Volunteer Visit Assignment ─────
    @PostMapping("/assign-volunteer")
    public ResponseEntity<String> assignVolunteer(@RequestBody VisitDateDto dto) {
        adminService.assignVolunteerToVisit(dto.getVolunteerId(), dto.getPatientId(), dto.getVisitDate());
        return ResponseEntity.ok("Volunteer assigned successfully");
    }

    @GetMapping("/list-volunteers")
    public List<VolunteerDto> getVolunteers() {
        return adminService.getVolunteers();
    }

    @GetMapping("/list-patients")
    public List<PatientDto> getPatients() {
        return adminService.getAllPatients();
    }

    // ───── Equipment ─────
    @PostMapping("/allocate-equipment/{equipmentId}/to/{patientId}")
    public ResponseEntity<String> allocateEquipment(@PathVariable Long equipmentId, @PathVariable Long patientId) {
        adminService.allocateEquipment(equipmentId, patientId);
        return ResponseEntity.ok("Equipment allocated successfully");
    }

    @PostMapping("/deallocate-equipment/{equipmentId}")
    public ResponseEntity<String> deallocateEquipment(@PathVariable Long equipmentId) {
        adminService.deallocateEquipment(equipmentId);
        return ResponseEntity.ok("Equipment deallocated successfully");
    }

    @PostMapping("/add-equipment")
    public ResponseEntity<String> addEquipment(@RequestBody Equipment equipment) {
        adminService.addEquipment(equipment);
        return ResponseEntity.ok("Equipment added successfully");
    }

    @DeleteMapping("/delete-equipment")
    public ResponseEntity<String> deleteEquipment(@RequestParam Long id) {
        adminService.deleteEquipment(id);
        return ResponseEntity.ok("Equipment deleted successfully");
    }

    @GetMapping("/view-equipments")
    public List<EquipmentDto> viewEquipments() {
        return adminService.getAllEquipment();
    }

    // ───── Patient ─────
    @PostMapping("/add-patient")
    public ResponseEntity<String> addPatient(@RequestBody Patient patient) {
        adminService.addPatient(patient);
        return ResponseEntity.ok("Patient added successfully");
    }

    @DeleteMapping("/delete-patient")
    public ResponseEntity<String> deletePatient(@RequestParam long id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    // ───── Volunteer ─────
    @PostMapping("/add-volunteer")
    public ResponseEntity<String> addVolunteer(@RequestBody Volunteer volunteer) {
        adminService.addVolunteer(volunteer);
        return ResponseEntity.ok("Volunteer added successfully");
    }

    // ───── NEW: Consumables ─────
    @GetMapping("/consumables")
    public List<ConsumableDto> getAllConsumables() {
        return consumableService.findAll();
    }

    @PostMapping("/consumable")
    public ConsumableDto addConsumable(@RequestParam String name,
                                       @RequestParam(defaultValue = "0") int quantity) {
        return consumableService.create(name, quantity);
    }

    @PatchMapping("/adjust-consumable")
    public ResponseEntity<String> adjustConsumable(@RequestBody ConsumableAdjustment adj) {
        consumableService.adjustQuantity(adj.getConsumableId(), adj.getDelta());
        return ResponseEntity.ok("Consumable stock adjusted");
    }
}
