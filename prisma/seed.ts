import { AllergySeverity, LabTestStatus, PrismaClient, RecordType } from '@prisma/client';

// Declare process for Node.js environment
declare const process: any;

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding medical records service database...');

  // Check if data already exists
  const existingRecords = await prisma.medicalRecord.count();
  const existingPrescriptions = await prisma.prescription.count();
  const existingAllergies = await prisma.allergy.count();
  const existingImmunizations = await prisma.immunization.count();
  const existingLabTests = await prisma.labTest.count();

  if (
    existingRecords > 0 ||
    existingPrescriptions > 0 ||
    existingAllergies > 0 ||
    existingImmunizations > 0 ||
    existingLabTests > 0
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `⚠️  Database already contains ${existingRecords} medical records, ${existingPrescriptions} prescriptions, ${existingAllergies} allergies, ${existingImmunizations} immunizations, and ${existingLabTests} lab tests. Skipping seeding to avoid duplicates.`
    );
    return;
  }

  // eslint-disable-next-line no-console
  console.log('📝 No existing data found. Proceeding with seeding...');

  // Create sample medical records
  const medicalRecordsData = [
    {
      patientId: 1,
      doctorId: 1,
      appointmentId: 1,
      recordType: RecordType.CONSULTATION,
      title: 'Annual Physical Examination',
      description: 'Comprehensive annual health checkup',
      diagnosis: 'Healthy individual, no acute issues',
      treatment: 'Continue current lifestyle, annual follow-up recommended',
      medications: [{ name: 'Multivitamin', dosage: '1 tablet daily', duration: 'Ongoing' }],
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 70,
        height: 175,
      },
      notes: 'Patient is in good health, no concerns',
      isConfidential: false,
      createdBy: 1,
    },
    {
      patientId: 2,
      doctorId: 1,
      appointmentId: 2,
      recordType: RecordType.DIAGNOSIS,
      title: 'Headache Consultation',
      description: 'Patient complaining of mild headaches',
      diagnosis: 'Tension headache',
      treatment: 'Rest, hydration, stress management',
      medications: [{ name: 'Ibuprofen', dosage: '400mg as needed', duration: '3 days' }],
      vitalSigns: {
        bloodPressure: '118/78',
        heartRate: 68,
        temperature: 98.4,
      },
      notes: 'Patient reports improvement with rest',
      isConfidential: false,
      createdBy: 1,
    },
    {
      patientId: 3,
      doctorId: 2,
      appointmentId: 3,
      recordType: RecordType.EMERGENCY,
      title: 'Chest Pain Evaluation',
      description: 'Patient experiencing chest pain',
      diagnosis: 'Musculoskeletal chest pain',
      treatment: 'Pain management, rest, follow-up if symptoms persist',
      medications: [{ name: 'Acetaminophen', dosage: '500mg every 6 hours', duration: '5 days' }],
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: 85,
        temperature: 98.8,
        oxygenSaturation: 98,
      },
      notes: 'ECG normal, chest X-ray clear',
      isConfidential: false,
      createdBy: 2,
    },
  ];

  // Create medical records
  for (const record of medicalRecordsData) {
    await prisma.medicalRecord.create({
      data: record,
    });
  }

  // Create sample prescriptions
  const prescriptionsData = [
    {
      patientId: 1,
      doctorId: 1,
      medicalRecordId: 1,
      medicationName: 'Multivitamin',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: 'Ongoing',
      instructions: 'Take with breakfast',
      quantity: 90,
      refillsAllowed: 5,
      refillsUsed: 0,
      expiresAt: new Date('2025-12-31'),
    },
    {
      patientId: 2,
      doctorId: 1,
      medicalRecordId: 2,
      medicationName: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'As needed',
      duration: '3 days',
      instructions: 'Take with food, maximum 3 times per day',
      quantity: 9,
      refillsAllowed: 0,
      refillsUsed: 0,
      expiresAt: new Date('2025-06-30'),
    },
    {
      patientId: 3,
      doctorId: 2,
      medicalRecordId: 3,
      medicationName: 'Acetaminophen',
      dosage: '500mg',
      frequency: 'Every 6 hours',
      duration: '5 days',
      instructions: 'Take with water, do not exceed 4g per day',
      quantity: 20,
      refillsAllowed: 1,
      refillsUsed: 0,
      expiresAt: new Date('2025-03-31'),
    },
  ];

  // Create prescriptions
  for (const prescription of prescriptionsData) {
    await prisma.prescription.create({
      data: prescription,
    });
  }

  // Create sample allergies
  const allergiesData = [
    {
      patientId: 1,
      allergen: 'Penicillin',
      reaction: 'Skin rash',
      severity: AllergySeverity.MODERATE,
      notes: 'Allergic reaction occurred in childhood',
    },
    {
      patientId: 2,
      allergen: 'Shellfish',
      reaction: 'Hives and difficulty breathing',
      severity: AllergySeverity.SEVERE,
      notes: 'Avoid all shellfish products',
    },
    {
      patientId: 3,
      allergen: 'Latex',
      reaction: 'Contact dermatitis',
      severity: AllergySeverity.MILD,
      notes: 'Use latex-free products',
    },
  ];

  // Create allergies
  for (const allergy of allergiesData) {
    await prisma.allergy.create({
      data: allergy,
    });
  }

  // Create sample immunizations
  const immunizationsData = [
    {
      patientId: 1,
      vaccineName: 'COVID-19 Vaccine',
      vaccineType: 'mRNA',
      administeredAt: new Date('2024-01-15'),
      administeredBy: 1,
      lotNumber: 'COV-2024-001',
      expirationDate: new Date('2025-01-15'),
      nextDueDate: new Date('2025-01-15'),
      notes: 'Primary series completed',
    },
    {
      patientId: 2,
      vaccineName: 'Influenza Vaccine',
      vaccineType: 'Inactivated',
      administeredAt: new Date('2024-10-01'),
      administeredBy: 1,
      lotNumber: 'FLU-2024-002',
      expirationDate: new Date('2025-10-01'),
      nextDueDate: new Date('2025-10-01'),
      notes: 'Annual flu vaccination',
    },
    {
      patientId: 3,
      vaccineName: 'Tetanus Booster',
      vaccineType: 'Toxoid',
      administeredAt: new Date('2024-06-15'),
      administeredBy: 2,
      lotNumber: 'TET-2024-003',
      expirationDate: new Date('2034-06-15'),
      nextDueDate: new Date('2029-06-15'),
      notes: '10-year booster',
    },
  ];

  // Create immunizations
  for (const immunization of immunizationsData) {
    await prisma.immunization.create({
      data: immunization,
    });
  }

  // Create sample lab tests
  const labTestsData = [
    {
      patientId: 1,
      doctorId: 1,
      testName: 'Complete Blood Count',
      testType: 'Hematology',
      orderedAt: new Date('2024-12-15'),
      collectedAt: new Date('2024-12-15'),
      completedAt: new Date('2024-12-16'),
      results: {
        hemoglobin: '14.2 g/dL',
        hematocrit: '42%',
        whiteBloodCells: '7.5 x 10^9/L',
        platelets: '250 x 10^9/L',
      },
      referenceRange: {
        hemoglobin: '12.0-16.0 g/dL',
        hematocrit: '36-46%',
        whiteBloodCells: '4.5-11.0 x 10^9/L',
        platelets: '150-450 x 10^9/L',
      },
      status: LabTestStatus.COMPLETED,
      labName: 'Central Lab',
      labAddress: '123 Medical Center Dr',
    },
    {
      patientId: 2,
      doctorId: 1,
      testName: 'Lipid Panel',
      testType: 'Chemistry',
      orderedAt: new Date('2024-12-10'),
      collectedAt: new Date('2024-12-10'),
      completedAt: new Date('2024-12-11'),
      results: {
        totalCholesterol: '180 mg/dL',
        ldlCholesterol: '110 mg/dL',
        hdlCholesterol: '45 mg/dL',
        triglycerides: '125 mg/dL',
      },
      referenceRange: {
        totalCholesterol: '<200 mg/dL',
        ldlCholesterol: '<100 mg/dL',
        hdlCholesterol: '>40 mg/dL',
        triglycerides: '<150 mg/dL',
      },
      status: LabTestStatus.COMPLETED,
      labName: 'Central Lab',
      labAddress: '123 Medical Center Dr',
    },
    {
      patientId: 3,
      doctorId: 2,
      testName: 'ECG',
      testType: 'Cardiology',
      orderedAt: new Date('2024-12-19'),
      collectedAt: new Date('2024-12-19'),
      completedAt: new Date('2024-12-19'),
      results: {
        rhythm: 'Normal sinus rhythm',
        rate: '85 bpm',
        prInterval: '160 ms',
        qrsDuration: '90 ms',
        qtInterval: '380 ms',
      },
      referenceRange: {
        rhythm: 'Normal sinus rhythm',
        rate: '60-100 bpm',
        prInterval: '120-200 ms',
        qrsDuration: '80-120 ms',
        qtInterval: '350-450 ms',
      },
      status: LabTestStatus.COMPLETED,
      labName: 'Cardiology Lab',
      labAddress: '456 Heart Center Ave',
    },
  ];

  // Create lab tests
  for (const labTest of labTestsData) {
    await prisma.labTest.create({
      data: labTest,
    });
  }

  // eslint-disable-next-line no-console
  console.log('✅ Medical records service seeding completed!');
  // eslint-disable-next-line no-console
  console.log(`📋 Created ${medicalRecordsData.length} medical records`);
  // eslint-disable-next-line no-console
  console.log(`💊 Created ${prescriptionsData.length} prescriptions`);
  // eslint-disable-next-line no-console
  console.log(`🚫 Created ${allergiesData.length} allergy records`);
  // eslint-disable-next-line no-console
  console.log(`💉 Created ${immunizationsData.length} immunization records`);
  // eslint-disable-next-line no-console
  console.log(`🧪 Created ${labTestsData.length} lab test records`);
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error('❌ Error seeding medical records service:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
