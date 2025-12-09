import { z } from "zod/v4";
import { formatDate } from "@/utils/date";
import { passwordSchema } from "@/schema/password";

export const faculties = [
  "Agricultural Sciences",
  "Arts and Social Sciences",
  "Basic Clinical Sciences",
  "Basic Medical Sciences",
  "Clinical Sciences",
  "Computing and Informatics",
  "Environmental Sciences",
  "Engineering and Technology",
  "Food and Consumer Sciences",
  "Management Sciences",
  "Nursing Sciences",
  "Pure and Applied Sciences",
  "Renewable Natural Resources",
];

export const departmentsByFaculty: Record<string, string[]> = {
  "Agricultural Sciences": [
    "Agricultural Economics",
    "Agricultural Extension and Rural Development",
    "Animal Nutrition and Biotechnology",
    "Animal Production and Health",
    "Crop and Environmental Protection",
    "Crop Production & Soil Science",
  ],
  "Basic Medical Sciences": [
    "Anatomy",
    "Medical Laboratory Science",
    "Physiology",
  ],
  "Basic Clinical Sciences": [
    "Chemical Pathology",
    "Haematology and Blood Transfusion",
    "Medical Microbiology and Parasitology",
    "Morbid Anatomy & Histopathology",
    "Pharmacology & Therapeutics",
  ],
  "Clinical Sciences": [
    "Anaesthesia",
    "Community Medicine",
    "Ear, Nose and Throat",
    "Medicine",
    "Obstetrics and Gynaecology",
    "Ophthalmology",
    "Pediatrics and Child Health",
    "Psychiatry",
    "Radiology",
    "Surgery",
  ],
  "Nursing Sciences": [
    "Mental Health/Psychiatric Nursing",
    "Medical/Surgical Nursing",
    "Maternal and Child Health Nursing",
    "Public/Community Health Nursing",
  ],
  "Computing and Informatics": [
    "Computer Science",
    "Cyber Security Science",
    "Information Systems",
  ],
  "Environmental Sciences": [
    "Architecture",
    "Building",
    "Estate Management",
    "Fine and Applied Arts",
    "Surveying and Geoinformatics",
    "Urban and Regional Planning",
  ],
  "Engineering and Technology": [
    "Agricultural Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electronic and Electrical Engineering",
    "Food Engineering",
    "Mechanical Engineering",
  ],
  "Food and Consumer Sciences": [
    "Food Science",
    "Consumer and Home Economics",
    "Hospitality and Tourism",
    "Nutrition and Dietetics",
  ],
  "Pure and Applied Sciences": [
    "Biochemistry",
    "Earth Sciences",
    "General Studies",
    "Pure and Applied Biology",
    "Pure and Applied Chemistry",
    "Pure and Applied Mathematics",
    "Pure and Applied Physics",
    "Science Laboratory Technology",
    "Statistics",
  ],
  "Management Sciences": [
    "Accounting",
    "Business Management",
    "Marketing",
    "Transport Management",
  ],
  "Arts and Social Sciences": [
    "Economics",
    "English and Literary Studies",
    "History and International Studies",
    "Library and Information Science",
    "Mass Communication",
    "Philosophy",
    "Political Science",
    "Psychology",
    "Sociology",
  ],
  "Renewable Natural Resources": [
    "Aquaculture and Fisheries Management",
    "Forest Resource Management",
    "Wildlife and Ecotourism Management",
  ],
};

function isValidDepartmentForFaculty(
  data: z.infer<typeof personalDetailsSchema>
): boolean {
  const { faculty, department } = data;
  if (typeof faculty !== "string" || !faculties.includes(faculty)) {
    return false;
  }

  const departments = departmentsByFaculty[faculty];
  return departments ? departments.includes(department ?? "") : false;
}

export const personalDetailsSchema = z
  .object({
    title: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().optional().default(""),
    maidenName: z.string().optional().default(""),
    nickname: z.string().optional().default(""),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    photoUrl: z.string().nullable().default(null),
    dateOfBirth: z.string().nullable().default(null),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    faculty: z.string().refine((val) => faculties.includes(val), {
      message: "Invalid faculty selected",
    }),
    department: z.string().min(1, "Department is required").nullable(),
    classSet: z
      .string()
      .min(4, "Class set is required")
      .nullable()
      .default(null)
      .transform((value) => {
        if (!value) return null;
        return formatDate(value, "yyyy");
      }),
  })

export const locationDetailsSchema = z.object({
  countryOfOrigin: z.string().min(1, "Country of origin is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  stateOfResidence: z.string().min(1, "State/Region of residence is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export const accountCredentialsSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: passwordSchema,
});

export const registrationSchema = personalDetailsSchema
  .extend(locationDetailsSchema.shape)
  .extend(accountCredentialsSchema.shape);
