package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.*;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.*;
import com.erfan.cch.Services.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {


    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    @PostMapping("/procedure")
    public ResponseEntity<String> addProcedure(@RequestParam String name) {
        adminService.addProcedure(name);
        return ResponseEntity.ok("ProcedureDone added successfully");
    }

    @GetMapping("/procedures")
    public ResponseEntity<List<ProcedureDoneDto>> getAllProcedures() {
        return ResponseEntity.ok(adminService.getAllProcedures());
    }

    @PostMapping("/assign-volunteer")
    public ResponseEntity<String> assignVolunteer(@RequestBody VisitDateDto visitDateDto) {
        adminService.assignVolunteerToPatients(
                visitDateDto.getVolunteerId(),
                visitDateDto.getPatientIds(),  // ✅ list of patient IDs
                visitDateDto.getVisitDate()
        );
        return ResponseEntity.ok("Volunteer assigned successfully to patients");
    }


    @GetMapping("list-volunteers")
    public  ResponseEntity<Page<VolunteerDto>> getVolunteers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search) {
         Pageable pageable = PageRequest.of(page,size,Sort.by(sortBy));
         Page<VolunteerDto> volunteers = adminService.getVolunteers(search,pageable);
         return ResponseEntity.ok(volunteers);
    }
    @GetMapping("list-patients")
    public ResponseEntity<Page<PatientDto>> getPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<PatientDto> patients = adminService.getAllPatients(search, pageable);
        return ResponseEntity.ok(patients);
    }
    @GetMapping("/view-equipments")
    public  ResponseEntity<Page<EquipmentDto>> viewEquipments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<EquipmentDto> equipments = adminService.getAllEquipment(search,pageable);
        return ResponseEntity.ok(equipments);
    }

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
    @PostMapping("/add-patient")
    public ResponseEntity<String> addPatient(@RequestBody Patient patient) {
        adminService.addPatient(patient);
        return ResponseEntity.ok("Patient added successfully");
    }
    @DeleteMapping ("/delete-patient")
    public ResponseEntity<String> deletePatient(@RequestParam long id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    @PostMapping("/add-volunteer")
    public ResponseEntity<String> addVolunteer(@RequestBody Volunteer volunteer) {
        adminService.addVolunteer(volunteer);
        return ResponseEntity.ok("Volunteer added successfully");
    }
    @DeleteMapping("/delete-volunteer")
    public ResponseEntity<String> deleteVolunteer(@RequestParam Long id){
        adminService.deleteVolunteer(id);
        return ResponseEntity.ok("Volunteer deleted successfully");
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

    @GetMapping("/dashboard-stats")
    public DashboardStatsDto dashboardStats(){
        return adminService.dashboardStats();
    }
    @GetMapping("/visits")
    public ResponseEntity<Page<PatientVisitReportDto>> getVisits(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getVisits(status, startDate, endDate, page, size));
    }

    @DeleteMapping("/delete-procedure")
    public ResponseEntity<String> deleteProcedure(@RequestParam Long id){
        adminService.deleteProcedure(id);
        return ResponseEntity.ok("Procedure deleted Successfully");
    }
    @PostMapping("consumable/add")
    public Consumable addConsumable(@RequestBody Consumable consumable) {
        return adminService.addConsumable(consumable);
    }
    // ✅ Add stock
    @PutMapping("consumable/{id}/add-stock")
    public Consumable addStock(@PathVariable Long id, @RequestParam int quantity) {
        return adminService.updateStock(id, quantity, true);
    }

    // ✅ Subtract stock
    @PutMapping("consumable/{id}/subtract-stock")
    public Consumable subtractStock(@PathVariable Long id, @RequestParam int quantity) {
        return adminService.updateStock(id, quantity, false);
    }

    @GetMapping("/consumable/list")
    public List<Consumable> listConsumables() {
        return adminService.getAllConsumables();
    }

    @DeleteMapping("consumable/delete/{id}")
    public void deleteConsumable(@PathVariable Long id) {
        adminService.deleteConsumable(id);
    }
}

