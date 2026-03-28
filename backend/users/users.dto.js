import Joi from "joi";

const Gender = ["MALE", "FEMALE", "OTHER"];
const Province = [
  "KOSHI",
  "MADHESH",
  "BAGMATI",
  "GANDAKI",
  "LUMBINI",
  "KARNALI",
  "SUDURPASHCHIM",
];
const District = [
  // KOSHI
  "TAPLEJUNG",
  "SANKHUWASABHA",
  "SOLUKHUMBU",
  "OKHALDHUNGA",
  "KHOTANG",
  "BHOJPUR",
  "DHANKUTA",
  "TERHATHUM",
  "PANCHTHAR",
  "ILAM",
  "JHAPA",
  "MORANG",
  "SUNSARI",
  "UDAYAPUR",
  // MADHESH
  "SAPTARI",
  "SIRAHA",
  "DHANUSHA",
  "MAHOTTARI",
  "SARLAHI",
  "RAUTAHAT",
  "BARA",
  "PARSA",
  // BAGMATI
  "SINDHULI",
  "RAMECHHAP",
  "DOLAKHA",
  "SINDHUPALCHOK",
  "KAVREPALANCHOK",
  "LALITPUR",
  "BHAKTAPUR",
  "KATHMANDU",
  "NUWAKOT",
  "RASUWA",
  "DHADING",
  "MAKWANPUR",
  "CHITWAN",
  // GANDAKI
  "GORKHA",
  "MANANG",
  "MUSTANG",
  "MYAGDI",
  "KASKI",
  "LAMJUNG",
  "TANAHU",
  "NAWALPUR",
  "SYANGJA",
  "PARBAT",
  "BAGLUNG",
  // LUMBINI
  "RUKUM_EAST",
  "ROLPA",
  "PYUTHAN",
  "GULMI",
  "ARGHAKHANCHI",
  "PALPA",
  "NAWALPARASI_EAST",
  "RUPANDEHI",
  "KAPILVASTU",
  "DANG",
  "BANKE",
  "BARDIYA",
  // KARNALI
  "DOLPA",
  "MUGU",
  "HUMLA",
  "JUMLA",
  "KALIKOT",
  "DAILEKH",
  "JAJARKOT",
  "RUKUM_WEST",
  "SALYAN",
  "SURKHET",
  // SUDURPASHCHIM
  "BAJURA",
  "BAJHANG",
  "ACHHAM",
  "DOTI",
  "KAILALI",
  "KANCHANPUR",
  "DADELDHURA",
  "BAITADI",
  "DARCHULA",
];

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 50 characters",
    "any.required": "Name is required",
  }),
  dob: Joi.date().iso().max("now").required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
    "date.max": "Date of birth cannot be in the future",
    "any.required": "Date of birth is required",
  }),
  gender: Joi.string()
    .valid(...Gender)
    .required()
    .messages({
      "any.only": `Gender must be one of: ${Gender.join(", ")}`,
      "any.required": "Gender is required",
    }),
  district: Joi.string()
    .valid(...District)
    .required()
    .messages({
      "any.only": "Invalid district. Must be a valid Nepal district key",
      "any.required": "District is required",
    }),
  province: Joi.string()
    .valid(...Province)
    .required()
    .messages({
      "any.only": `Province must be one of: ${Province.join(", ")}`,
      "any.required": "Province is required",
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      "string.base": "PIN must be a string",
      "string.length": "PIN must be exactly 4 digits",
      "string.pattern.base": "PIN must contain only numbers",
      "any.required": "PIN is required",
    }),
});
export const loginUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required",
  }),
  dob: Joi.date().iso().max("now").required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
    "date.max": "Date of birth cannot be in the future",
    "any.required": "Date of birth is required",
  }),
  pin: Joi.string()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      "string.base": "PIN must be a string",
      "string.length": "PIN must be exactly 4 digits",
      "string.pattern.base": "PIN must contain only numbers",
      "any.required": "PIN is required",
    }),
});
