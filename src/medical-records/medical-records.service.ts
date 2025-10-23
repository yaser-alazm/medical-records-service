import {
  CreateAllergyDto,
  CreateImmunizationDto,
  CreateLabTestDto,
  CreateMedicalRecordDto,
  CreatePrescriptionDto,
  DoctoriLogger,
  Prescription,
  UpdateMedicalRecordDto,
} from '@doctori/shared';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  private readonly logger = new DoctoriLogger('MedicalRecordsService');

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  // Medical Records CRUD
  async createMedicalRecord(data: CreateMedicalRecordDto) {
    const medicalRecord = await this.prisma.medicalRecord.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        medications: data.medications as Prisma.InputJsonValue,
        vitalSigns: data.vitalSigns as Prisma.InputJsonValue,
        labResults: data.labResults as Prisma.InputJsonValue,
        imagingResults: data.imagingResults as Prisma.InputJsonValue,
        attachments: data.attachments as Prisma.InputJsonValue,
      },
    });

    this.eventEmitter.emit('medical_record.created', {
      recordId: medicalRecord.id,
      patientId: medicalRecord.patientId,
      doctorId: medicalRecord.doctorId,
      recordType: medicalRecord.recordType,
    });

    this.logger.logBusinessEvent('Medical record created', {
      recordId: medicalRecord.id,
      patientId: medicalRecord.patientId,
      doctorId: medicalRecord.doctorId,
    });

    return medicalRecord;
  }

  async getMedicalRecordById(id: number) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return record;
  }

  async getMedicalRecordsByPatient(patientId: number) {
    return this.prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMedicalRecordsByDoctor(doctorId: number) {
    return this.prisma.medicalRecord.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateMedicalRecord(id: number, data: UpdateMedicalRecordDto) {
    const record = await this.prisma.medicalRecord.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        medications: data.medications as Prisma.InputJsonValue,
        vitalSigns: data.vitalSigns as Prisma.InputJsonValue,
        labResults: data.labResults as Prisma.InputJsonValue,
        imagingResults: data.imagingResults as Prisma.InputJsonValue,
        attachments: data.attachments as Prisma.InputJsonValue,
      },
    });

    this.eventEmitter.emit('medical_record.updated', {
      recordId: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
    });

    this.logger.logBusinessEvent('Medical record updated', {
      recordId: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
    });

    return record;
  }

  async deleteMedicalRecord(id: number) {
    const record = await this.prisma.medicalRecord.delete({
      where: { id },
    });

    this.eventEmitter.emit('medical_record.deleted', {
      recordId: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
    });

    this.logger.logBusinessEvent('Medical record deleted', {
      recordId: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
    });

    return record;
  }

  // Prescription Management
  async createPrescription(data: CreatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.prisma.prescription.create({
      data: {
        ...data,
        prescribedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('prescription.created', {
      prescriptionId: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: prescription.medicationName,
    });

    this.logger.logBusinessEvent('Prescription created', {
      prescriptionId: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
    });

    return prescription;
  }

  async getPrescriptionsByPatient(patientId: number) {
    return this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { prescribedAt: 'desc' },
    });
  }

  async getActivePrescriptions(patientId: number) {
    return this.prisma.prescription.findMany({
      where: {
        patientId,
        isActive: true,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: { prescribedAt: 'desc' },
    });
  }

  async refillPrescription(id: number) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.refillsUsed >= prescription.refillsAllowed) {
      throw new ConflictException('No refills remaining');
    }

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id },
      data: {
        refillsUsed: prescription.refillsUsed + 1,
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('prescription.refilled', {
      prescriptionId: prescription.id,
      patientId: prescription.patientId,
      refillsUsed: updatedPrescription.refillsUsed,
    });

    this.logger.logBusinessEvent('Prescription refilled', {
      prescriptionId: prescription.id,
      patientId: prescription.patientId,
    });

    return updatedPrescription;
  }

  // Allergy Management
  async createAllergy(data: CreateAllergyDto) {
    const allergy = await this.prisma.allergy.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('allergy.created', {
      allergyId: allergy.id,
      patientId: allergy.patientId,
      allergen: allergy.allergen,
    });

    this.logger.logBusinessEvent('Allergy recorded', {
      allergyId: allergy.id,
      patientId: allergy.patientId,
      allergen: allergy.allergen,
    });

    return allergy;
  }

  async getAllergiesByPatient(patientId: number) {
    return this.prisma.allergy.findMany({
      where: { patientId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Immunization Management
  async createImmunization(data: CreateImmunizationDto) {
    const immunization = await this.prisma.immunization.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('immunization.created', {
      immunizationId: immunization.id,
      patientId: immunization.patientId,
      vaccineName: immunization.vaccineName,
    });

    this.logger.logBusinessEvent('Immunization recorded', {
      immunizationId: immunization.id,
      patientId: immunization.patientId,
      vaccineName: immunization.vaccineName,
    });

    return immunization;
  }

  async getImmunizationsByPatient(patientId: number) {
    return this.prisma.immunization.findMany({
      where: { patientId },
      orderBy: { administeredAt: 'desc' },
    });
  }

  // Lab Test Management
  async createLabTest(data: CreateLabTestDto) {
    const labTest = await this.prisma.labTest.create({
      data: {
        ...data,
        results: data.results as Prisma.InputJsonValue,
        referenceRange: data.referenceRange as Prisma.InputJsonValue,
        orderedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('lab_test.created', {
      labTestId: labTest.id,
      patientId: labTest.patientId,
      doctorId: labTest.doctorId,
      testName: labTest.testName,
    });

    this.logger.logBusinessEvent('Lab test ordered', {
      labTestId: labTest.id,
      patientId: labTest.patientId,
      doctorId: labTest.doctorId,
    });

    return labTest;
  }

  async updateLabTestResults(id: number, results: Record<string, unknown>) {
    const labTest = await this.prisma.labTest.update({
      where: { id },
      data: {
        results: results as Prisma.InputJsonValue,
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.eventEmitter.emit('lab_test.completed', {
      labTestId: labTest.id,
      patientId: labTest.patientId,
      doctorId: labTest.doctorId,
      testName: labTest.testName,
    });

    this.logger.logBusinessEvent('Lab test completed', {
      labTestId: labTest.id,
      patientId: labTest.patientId,
      doctorId: labTest.doctorId,
    });

    return labTest;
  }

  async getLabTestsByPatient(patientId: number) {
    return this.prisma.labTest.findMany({
      where: { patientId },
      orderBy: { orderedAt: 'desc' },
    });
  }

  // Statistics and Analytics
  async getPatientHealthSummary(patientId: number) {
    const [records, prescriptions, allergies, immunizations, labTests] = await Promise.all([
      this.prisma.medicalRecord.count({ where: { patientId } }),
      this.prisma.prescription.count({ where: { patientId } }),
      this.prisma.allergy.count({ where: { patientId, isActive: true } }),
      this.prisma.immunization.count({ where: { patientId } }),
      this.prisma.labTest.count({ where: { patientId } }),
    ]);

    return {
      totalRecords: records,
      totalPrescriptions: prescriptions,
      activeAllergies: allergies,
      totalImmunizations: immunizations,
      totalLabTests: labTests,
    };
  }
}
