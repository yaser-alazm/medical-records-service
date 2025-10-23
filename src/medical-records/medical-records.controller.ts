import {
  CreateAllergyDto,
  CreateImmunizationDto,
  CreateLabTestDto,
  CreateMedicalRecordDto,
  CreatePrescriptionDto,
  UpdateMedicalRecordDto,
} from '@doctori/shared';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';

@ApiTags('Medical Records')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  // Medical Records Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully' })
  async create(@Body() data: CreateMedicalRecordDto) {
    return this.medicalRecordsService.createMedicalRecord(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiResponse({ status: 200, description: 'Medical record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  async findOne(@Param('id') id: string) {
    return this.medicalRecordsService.getMedicalRecordById(+id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical records by patient' })
  @ApiResponse({ status: 200, description: 'Patient medical records retrieved' })
  async findByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getMedicalRecordsByPatient(+patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get medical records by doctor' })
  @ApiResponse({ status: 200, description: 'Doctor medical records retrieved' })
  async findByDoctor(@Param('doctorId') doctorId: string) {
    return this.medicalRecordsService.getMedicalRecordsByDoctor(+doctorId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update medical record' })
  @ApiResponse({ status: 200, description: 'Medical record updated successfully' })
  async update(@Param('id') id: string, @Body() data: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.updateMedicalRecord(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete medical record' })
  @ApiResponse({ status: 200, description: 'Medical record deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.medicalRecordsService.deleteMedicalRecord(+id);
  }

  // Prescription Endpoints
  @Post('prescriptions')
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  async createPrescription(@Body() data: CreatePrescriptionDto) {
    return this.medicalRecordsService.createPrescription(data);
  }

  @Get('prescriptions/patient/:patientId')
  @ApiOperation({ summary: 'Get prescriptions by patient' })
  @ApiResponse({ status: 200, description: 'Patient prescriptions retrieved' })
  async getPrescriptionsByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getPrescriptionsByPatient(+patientId);
  }

  @Get('prescriptions/patient/:patientId/active')
  @ApiOperation({ summary: 'Get active prescriptions by patient' })
  @ApiResponse({ status: 200, description: 'Active prescriptions retrieved' })
  async getActivePrescriptions(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getActivePrescriptions(+patientId);
  }

  @Put('prescriptions/:id/refill')
  @ApiOperation({ summary: 'Refill prescription' })
  @ApiResponse({ status: 200, description: 'Prescription refilled successfully' })
  async refillPrescription(@Param('id') id: string) {
    return this.medicalRecordsService.refillPrescription(+id);
  }

  // Allergy Endpoints
  @Post('allergies')
  @ApiOperation({ summary: 'Create a new allergy record' })
  @ApiResponse({ status: 201, description: 'Allergy record created successfully' })
  async createAllergy(@Body() data: CreateAllergyDto) {
    return this.medicalRecordsService.createAllergy(data);
  }

  @Get('allergies/patient/:patientId')
  @ApiOperation({ summary: 'Get allergies by patient' })
  @ApiResponse({ status: 200, description: 'Patient allergies retrieved' })
  async getAllergiesByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getAllergiesByPatient(+patientId);
  }

  // Immunization Endpoints
  @Post('immunizations')
  @ApiOperation({ summary: 'Create a new immunization record' })
  @ApiResponse({ status: 201, description: 'Immunization record created successfully' })
  async createImmunization(@Body() data: CreateImmunizationDto) {
    return this.medicalRecordsService.createImmunization(data);
  }

  @Get('immunizations/patient/:patientId')
  @ApiOperation({ summary: 'Get immunizations by patient' })
  @ApiResponse({ status: 200, description: 'Patient immunizations retrieved' })
  async getImmunizationsByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getImmunizationsByPatient(+patientId);
  }

  // Lab Test Endpoints
  @Post('lab-tests')
  @ApiOperation({ summary: 'Create a new lab test order' })
  @ApiResponse({ status: 201, description: 'Lab test ordered successfully' })
  async createLabTest(@Body() data: CreateLabTestDto) {
    return this.medicalRecordsService.createLabTest(data);
  }

  @Put('lab-tests/:id/results')
  @ApiOperation({ summary: 'Update lab test results' })
  @ApiResponse({ status: 200, description: 'Lab test results updated successfully' })
  async updateLabTestResults(@Param('id') id: string, @Body() results: Record<string, unknown>) {
    return this.medicalRecordsService.updateLabTestResults(+id, results);
  }

  @Get('lab-tests/patient/:patientId')
  @ApiOperation({ summary: 'Get lab tests by patient' })
  @ApiResponse({ status: 200, description: 'Patient lab tests retrieved' })
  async getLabTestsByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getLabTestsByPatient(+patientId);
  }

  // Health Summary
  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get patient health summary' })
  @ApiResponse({ status: 200, description: 'Patient health summary retrieved' })
  async getPatientHealthSummary(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getPatientHealthSummary(+patientId);
  }
}
