export default {
  MESSAGES: {
    NO_ACCESS: {
      code: "NO_ACCESS",
      message: "Un-Authorised Access!!",
    },
     INCLUDE_PERMISSION: {
      code: "INCLUDE_PERMISSION",
      message: "Include Permission!!",
    },
     NO_TOKEN: {
      code: "NO_TOKEN",
      message: "No Token Provided!!",
    },
    INTERNAL_SERVER_ERROR: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error!!",
    },
    DUPLICATE_NATIONAL_ID:{
      code: "DUPLICATE_NATIONAL_ID",
      message: "Duplicate National ID!!",
    },
    LOGIN_SUCCESS: {
      code: "LOGIN_SUCCESS",
      message: "Login Successful!!",
    },
    INVALID_CREDENTIALS: {
      code: "INVALID_CREDENTIALS",
      message: "Invalid Credentials!!",
    },
    SOMETHING_WENT_WRONG: {
      DELETE: {
        code: "NOT_DELETED",
        message: "Something Went Wrong!!",
      },
      FIND: {
        code: "NOT_FOUND",
        message: "Something Went Wrong!!",
      },
      CREATE: {
        code: "NOT_CREATED",
        message: "Something Went Wrong!!",
      },
      UPDATE: {
        code: "NOT_UPDATED",
        message: "Something Went Wrong!!",
      },
    },
    EMP_NOT_FOUND: {
      code: "EMP_NOT_FOUND",
      message: "Employee Not Found!!",
    },
    NO_CHANGES: {
      code: "NO_CHANGES_IN_REQUEST",
      message: "No Changes in the API!!",
    },
    CREATED_BY_REQ: {
      code: "CREATED_BY_REQUIRED",
      message: "Created By Required!!",
    },
    NOT_FOUND: {
      code: "NOT_FOUND",
      message: "Not Found!!",
    },
    INVALID_PASSWORD: {
      code: "INVALID_PASSWORD",
      message: "Invalid Password!!",
    },
    INVALID_OTP: {
      code: "INVALID_OTP",
      message: "Invalid Otp!!",
    },
    OTP_EXPIRED: {
      code: "OTP_EXPIRED",
      message: "OTP Expired!!",
    },
    FORBIDDEN_INTERNAL_FIELDS: {
      PATIENTS: {
        code: "FORBIDDEN_PATIENT_ID",
        message: "Forbidden Parameters",
      },
      FORBIDDEN: {
        code: "FORBIDDEN_FIELDS",
        message: "Forbidden Parameters",
      },
    },
    ID_REQ: {
      code: "ID_REQ",
      message: "ID is required!!",
    },
    SUCCESS: {
      code: "SUCCESS",
      message: "Successfull!!",
    },
    INVALID_FORMAT: {
      code: "INVALID_FORMAT",
      message: "Invalid Format!!",
    },
    CHANGE_HOURS: {
      code: "CHANGE_HOURS",
      message: "Please Change Hours!!",
    },
    PAGE: {
      code: "PAGE_REQUIRED",
      message: "Page no. is Required!!",
    },
    LIMIT: {
      code: "LIMIT_REQUIRED",
      message: "Limit is Required!!",
    },
    ORG_NAME_REQUIRED: {
      code: "ORG_NAME_REQUIRED",
      message: "Organization name is required!!",
    },
    INVALID_ORG_TYPE: {
      code: "INVALID_ORG_TYPE",
      message: "Invalid organization type!!",
    },
    INSTITUTION_CODE_REQUIRED: {
      code: "INSTITUTION_CODE_REQUIRED",
      message: "Institution code is required!!",
    },
    INTERNAL_CODE_REQUIRED: {
      code: "INTERNAL_CODE_REQUIRED",
      message: "Internal code is required!!",
    },
    INVALID_BUILDING_SIZE: {
      code: "INVALID_BUILDING_SIZE",
      message: "Building size must be between 3 and 1000 square meters!!",
    },
    INVALID_AREA_IN: {
      code: "INVALID_AREA_IN",
      message: "Invalid area selection!!",
    },
    INVALID_ROOMS_FORMAT: {
      code: "INVALID_ROOMS_FORMAT",
      message: "Invalid number of rooms!!",
    },
    INVALID_PROTECTED_SPACE: {
      code: "INVALID_PROTECTED_SPACE",
      message: "Protected space must be true or false!!",
    },
    INVALID_PATIENT_COUNT: {
      code: "INVALID_PATIENT_COUNT",
      message: "Number of patients must be between 0 and 30!!",
    },
    OPERATING_HOURS_REQUIRED: {
      code: "OPERATING_HOURS_REQUIRED",
      message: "Operating hours are required!!",
    },
    INVALID_OPERATING_HOURS: {
      code: "INVALID_OPERATING_HOURS",
      message: "Each operating hour must include day, startTime, and endTime!!",
    },
    ADDRESS_REQUIRED: {
      code: "ADDRESS_REQUIRED",
      message: "Address details are required!!",
    },
    INVALID_ADDRESS: {
      code: "INVALID_ADDRESS",
      message:
        "Each address must include city, country, address, and postal code!!",
    },
    CONTACT_REQUIRED: {
      code: "CONTACT_REQUIRED",
      message: "At least one contact is required!!",
    },
    INVALID_CONTACT: {
      code: "INVALID_CONTACT",
      message: "Each contact must include name, role, phone, and email!!",
    },
    INVALID_ROLE: {
      code: "INVALID_ROLE",
      message: "Invalid contact role!!",
    },
    INVALID_FIXED_COST: {
      code: "INVALID_FIXED_COST",
      message:
        "Each fixed cost must include type, amount, and recurrence (monthly/yearly)!!",
    },
    ALREADY_EXISTS: {
      code: "ALREADY_EXISTS",
      message: "Already Exists!!",
    },
    PATIENT_ID_REQ: {
      code: "PATIENT_ID_REQ",
      message: "Patient ID is required!!",
    },
    FIRST_NAME_REQ: {
      code: "FIRST_NAME_REQ",
      message: "First name is required!!",
    },
    LAST_NAME_REQ: {
      code: "LAST_NAME_REQ",
      message: "Last name is required!!",
    },
    NATIONAL_ID_REQ: {
      code: "NATIONAL_ID_REQ",
      message: "National ID is required!!",
    },
    GENDER_REQ: {
      code: "GENDER_REQ",
      message: "Gender is required!!",
    },
    DOB_REQ: {
      code: "DOB_REQ",
      message: "Date of birth is required!!",
    },
    ADDRESS_REQ: {
      code: "ADDRESS_REQ",
      message: "Address object is required!!",
    },
    CITY_REQ: {
      code: "CITY_REQ",
      message: "City is required!!",
    },
    COUNTRY_REQ: {
      code: "COUNTRY_REQ",
      message: "Country is required!!",
    },
     STATE_REQ: {
      code: "STATE_REQ",
      message: "Country is required!!",
    },
    ADDRESS_FIELD_REQ: {
      code: "ADDRESS_FIELD_REQ",
      message: "Address field is required!!",
    },
    POSTAL_CODE_REQ: {
      code: "POSTAL_CODE_REQ",
      message: "Postal code is required!!",
    },
    COMPANION_REQ: {
      code: "COMPANION_REQ",
      message: "Companion list is required!!",
    },
    COMPANION_NAME_REQ: {
      code: "COMPANION_NAME_REQ",
      message: "Companion full name is required!!",
    },
    CONTACT_NUM_REQ: {
      code: "CONTACT_NUM_REQ",
      message: "Companion contact number is required!!",
    },
    COMPANION_NID_REQ: {
      code: "COMPANION_NID_REQ",
      message: "Companion national ID is required!!",
    },
    RELATION_REQ: {
      code: "RELATION_REQ",
      message: "Relation with patient is required!!",
    },
    EMAIL_REQ: {
      code: "EMAIL_REQ",
      message: "Companion email is required!!",
    },
    BRANCH_NAME_REQ: {
      code: "BRANCH_NAME_REQ",
      message: "Branch name is required!!",
    },
    CLINIC_ID_REQ: {
      code: "CLINIC_ID_REQ",
      message: "Clinic ID is required!!",
    },
    ROOM_TYPE_REQ: {
      code: "ROOM_TYPE_REQ",
      message: "Room type is required!!",
    },

    ROOM_SIZE_REQ: {
      code: "ROOM_SIZE_REQ",
      message: "Room size is required!!",
    },
    OWNER_REQ: { code: "OWNER_REQ", message: "Owner is required!!" },
    MANAGER_REQ: { code: "MANAGER_REQ", message: "Manager ID is required!!" },
    THERAPIST_FIELD_REQ: {
      code: "THERAPIST_FIELD_REQ",
      message: "Therapist fields missing!!",
    },
    THERAPIST_UNAVAIL: {
      code: "THERAPIST_UNAVAIL",
      message: "Therapist Un-Available!!",
    },
    SPECIALISATION_FIELD_REQ: {
      code: "SPECIALISATION_FIELD_REQ",
      message: "Specialisation fields missing!!",
    },
    START_TIME_REQ: {
      code: "START_TIME_REQ",
      message: "Start Time Required!!",
    },
    END_TIME_REQ: {
      code: "END_TIME_REQ",
      message: "End Time Required!!",
    },
    THERAPIST: {
      NAME_REQ: {
        code: "THERAPIST_NAME_REQ",
        message: "Therapist Name Required!!",
      },
      ID_REQ: {
        code: "THERAPIST_ID_REQ",
        message: "Therapist Id Required!!",
      },
      ORGANISATION_REQ: {
        code: "THERAPIST_ORG_REQ",
        message: "Therapist Organisation Required!!",
      },
    },
    ROOM_UNAVAIL: {
      code: "ROOM_UNAVAIL",
      message: "Room Un-Available!!",
    },
  },
};
