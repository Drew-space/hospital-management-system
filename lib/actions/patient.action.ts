// "use server";

// import { ID, Query } from "node-appwrite";
// import { users } from "../appwrite.config";

// // export const createUser = async (user: CreateUserParams) => {
// //   try {
// //     const newUser = await users.create(
// //       ID.unique(),
// //       user.email,
// //       user.phone,
// //       undefined,
// //       user.name,
// //     );
// //     console.log(newUser);

// //     return newUser;
// //   } catch (error: any) {
// //     // user already exists
// //     if (error?.code === 409) {
// //       const existingUsers = await users.list([
// //         Query.equal("email", [user.email]),
// //       ]);

// //       console.log(error);

// //       return existingUsers.users[0];
// //     }

// //     console.error("APPWRITE ERROR:", JSON.stringify(error, null, 2));

// //     throw error;
// //   }
// // };

// export const createUser = async (user: CreateUserParams) => {
//   try {
//     const newUser = await users.create({
//       userId: ID.unique(),
//       email: user.email,
//       phone: user.phone,
//       name: user.name,
//     });
//     console.log(newUser);
//     return newUser;
//   } catch (error: any) {
//     if (error?.code === 409) {
//       const existingUsers = await users.list({
//         queries: [Query.equal("email", [user.email])],
//       });
//       return existingUsers.users[0];
//     }

//     console.error("APPWRITE ERROR:", JSON.stringify(error, null, 2));
//     throw error;
//   }
// };

"use server";

import { ID, Query } from "node-appwrite";

import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import {
  databases,
  storage,
  users,
  ENDPOINT,
  PROJECT_ID,
  BUCKET_ID,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
} from "../appwrite.config";

type CreateUserParams = {
  name: string;
  email: string;
  phone: string;
};

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      name: user.name,
    });

    return parseStringify(newUser);
  } catch (error: any) {
    if (error?.code === 409) {
      const existingUsers = await users.list({
        queries: [Query.equal("email", [user.email])],
      });

      return parseStringify(existingUsers.users[0]);
    }

    console.error("APPWRITE ERROR:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log("error", error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patient = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    );
    return parseStringify(patient.documents[0]);
  } catch (error) {
    console.log("error", error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string,
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
        privacyConcent: patient.privacyConsent,
      },
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
