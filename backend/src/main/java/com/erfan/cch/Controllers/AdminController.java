package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.*;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.*;
import com.erfan.cch.Services.AdminService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
        adminService.assignVolunteerToVisit(visitDateDto.getVolunteerId(),visitDateDto.getPatientId() ,visitDateDto.getVisitDate());
        return ResponseEntity.ok("Volunteer assigned successfully");
    }
    @GetMapping("list-volunteers")
    public  List<VolunteerDto> getVolunteers() {
         return adminService.getVolunteers();
    }
    @GetMapping("list-patients")
    public List<PatientDto> getPatients() {
        return adminService.getAllPatients();
    }
//    @GetMapping("/consumables-report")
//    public ResponseEntity<List<PatientVisitReport>> getConsumablesReport(
//            @RequestParam LocalDate startDate,
//            @RequestParam LocalDate endDate) {
//        return ResponseEntity.ok(adminService.getConsumablesUsageReport(startDate, endDate));
//    }

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
    @GetMapping("/view-equipments")
    public  List<EquipmentDto> viewEquipments() {
         return adminService.getAllEquipment();
    }
    @GetMapping("/dashboard-stats")
    public DashboardStatsDto dashboardStats(){
        return adminService.dashboardStats();
    }
    @GetMapping("/completed-visits")
    public ResponseEntity<List<PatientVisitReportDto>> getCompletedVisits() {
        return ResponseEntity.ok(adminService.getVisits(Status.COMPLETED));
    }
    @GetMapping("/pending-visits")
    public ResponseEntity<List<PatientVisitReportDto>> getPendingVisits(){
        return ResponseEntity.ok(adminService.getVisits(Status.PENDING));
    }
    @DeleteMapping("/delete-procedure")
    public ResponseEntity<String> deleteProcedure(@RequestParam Long id){
        adminService.deleteProcedure(id);
        return ResponseEntity.ok("Procedure deleted Successfully");
    }
}

