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
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

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
