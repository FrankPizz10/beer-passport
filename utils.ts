import { User } from "./Models/SQLData";

export function decimalToPercent(decimal: number) {
  const percent = Math.round(decimal * 100); // Multiply by 100 and round to 2 decimal places
  return percent + "%"; // Append "%" symbol
}

export const getErrorMessage = (
  errorCode: string,
  serverConnected: boolean,
) => {
  if (!serverConnected) {
    return "Server not connected";
  }
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "User account disabled.";
    case "auth/user-not-found":
      return "User account not found.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/missing-password":
      return "Missing password.";
    case "auth/weak-password":
      return "Password is too weak. Must be at least 6 characters long.";
    case "auth/email-already-exists":
      return "Email address already in use.";
    default:
      return "Unknown error occurred.";
  }
};

export const isEmpty = (obj: object | undefined) => {
  if (obj === undefined) return true;
  return Object.keys(obj).length === 0;
};

export const isUser = (obj: object): obj is User => {
  return "user_name" in obj;
};
